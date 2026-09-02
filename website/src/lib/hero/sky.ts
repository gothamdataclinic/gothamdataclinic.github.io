/**
 * Gotham Data Clinic — hero sky renderer
 *
 * One WebGL2 program, four vertices, no scene graph and no dependency. The
 * renderer deliberately owns no animation loop: SkyHero.svelte drives it, so
 * that the plate parallax and the sky stay on the same clock and there is one
 * place that decides when to stop drawing.
 */

import type { ParallaxView } from './parallax.js'
import { FRAG, VERT } from './sky.glsl.js'
import { LOOKS, type Look, type LookId } from './looks.js'

/** Hero-card rectangle in the host's own 0..1 space. */
export interface ShelterRect {
  x0: number
  y0: number
  x1: number
  y1: number
}

export interface SkyRenderer {
  readonly canvas: HTMLCanvasElement
  /** Crossfades over ~0.45s from wherever the palette currently is. */
  setLook: (id: LookId) => void
  setShelter: (rect: ShelterRect | null) => void
  /** Re-reads the host's size. Safe to call every frame; only acts on change. */
  resize: () => void
  render: (view: ParallaxView, t: number, dt: number) => void
  dispose: () => void
}

const VERTICAL_FOV = (42 * Math.PI) / 180
const MAX_DPR = 1.5
/** Above this the fragment cost stops buying visible quality on a gradient. */
const MAX_DEVICE_HEIGHT = 1150
const LOOK_DAMPING = 2.2 // 1/s, ~0.45s to settle
const SETTLED = 1e-3

const COLOR_KEYS = ['zenith', 'horizon', 'band', 'glow', 'sunDir', 'cloudLit', 'cloudShadow'] as const
const SCALAR_KEYS = ['bandK', 'starK', 'moonK', 'cover', 'exposure'] as const

type ColorKey = (typeof COLOR_KEYS)[number]
type ScalarKey = (typeof SCALAR_KEYS)[number]
type UniformName = ColorKey | ScalarKey | 'res' | 'time' | 'look' | 'tanHalfFov' | 'shelter' | 'shelterReach' | 'grainT'

/**
 * The palette the shader is currently showing. A look switch retargets it and
 * the render loop eases every channel, so an impatient second click crossfades
 * from the half-finished blend instead of snapping.
 */
type SkyState = { [K in ColorKey]: Float32Array } & { [K in ScalarKey]: number }

function stateFrom(look: Look): SkyState {
  const state = {} as SkyState
  for (const key of COLOR_KEYS) state[key] = new Float32Array(look[key])
  for (const key of SCALAR_KEYS) state[key] = look[key]
  return state
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`createSkyRenderer: shader compile failed: ${log}`)
  }
  return shader
}

export function createSkyRenderer(host: HTMLElement, initialLook: LookId): SkyRenderer | null {
  const canvas = document.createElement('canvas')
  canvas.className = 'sky-canvas'
  canvas.setAttribute('aria-hidden', 'true')

  let gl: WebGL2RenderingContext | null = null
  try {
    // Safari on some GPU configurations throws here rather than returning null.
    gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
  } catch {
    gl = null
  }
  if (!gl) return null

  const context = gl
  let program: WebGLProgram
  try {
    const vs = compile(context, context.VERTEX_SHADER, VERT)
    const fs = compile(context, context.FRAGMENT_SHADER, FRAG)
    program = context.createProgram()!
    context.attachShader(program, vs)
    context.attachShader(program, fs)
    context.linkProgram(program)
    context.deleteShader(vs)
    context.deleteShader(fs)
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      throw new Error(`createSkyRenderer: link failed: ${context.getProgramInfoLog(program)}`)
    }
  } catch (err) {
    console.error(err)
    return null
  }

  context.useProgram(program)

  const uniforms = {} as Record<UniformName, WebGLUniformLocation | null>
  const names: UniformName[] = [
    ...COLOR_KEYS,
    ...SCALAR_KEYS,
    'res',
    'time',
    'look',
    'tanHalfFov',
    'shelter',
    'shelterReach',
    'grainT',
  ]
  for (const name of names) {
    uniforms[name] = context.getUniformLocation(program, `u${name[0].toUpperCase()}${name.slice(1)}`)
  }
  context.uniform1f(uniforms.tanHalfFov, Math.tan(VERTICAL_FOV / 2))

  const state = stateFrom(LOOKS[initialLook])
  let target = LOOKS[initialLook]
  let settled = true

  const shelter = new Float32Array(4)
  let width = 0
  let height = 0

  host.prepend(canvas)

  return {
    canvas,

    setLook(id) {
      target = LOOKS[id]
      settled = false
    },

    setShelter(rect) {
      if (!rect) {
        shelter.fill(0)
        return
      }
      shelter[0] = rect.x0
      shelter[1] = rect.y0
      shelter[2] = rect.x1
      shelter[3] = rect.y1
    },

    resize() {
      const rect = host.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      let w = Math.max(2, Math.round(rect.width * dpr))
      let h = Math.max(2, Math.round(rect.height * dpr))
      if (h > MAX_DEVICE_HEIGHT) {
        // Scale both axes so a tall viewport loses resolution rather than aspect.
        w = Math.round((MAX_DEVICE_HEIGHT * w) / h)
        h = MAX_DEVICE_HEIGHT
      }
      if (w === width && h === height) return
      width = w
      height = h
      canvas.width = w
      canvas.height = h
      context.viewport(0, 0, w, h)
      context.uniform2f(uniforms.res, w, h)
    },

    render(view, t, dt) {
      if (!settled) {
        const k = 1 - Math.exp(-LOOK_DAMPING * dt)
        let done = true
        for (const key of COLOR_KEYS) {
          const cur = state[key]
          const to = target[key]
          for (let i = 0; i < 3; i++) {
            cur[i] += (to[i] - cur[i]) * k
            if (Math.abs(to[i] - cur[i]) > SETTLED) done = false
            else cur[i] = to[i]
          }
        }
        for (const key of SCALAR_KEYS) {
          state[key] += (target[key] - state[key]) * k
          if (Math.abs(target[key] - state[key]) > SETTLED) done = false
          else state[key] = target[key]
        }
        settled = done
      }

      context.uniform1f(uniforms.time, t)
      context.uniform2f(uniforms.look, view.pitch, view.yaw)
      for (const key of COLOR_KEYS) context.uniform3fv(uniforms[key], state[key])
      for (const key of SCALAR_KEYS) context.uniform1f(uniforms[key], state[key])
      context.uniform4fv(uniforms.shelter, shelter)
      context.uniform1f(uniforms.shelterReach, 0.16)
      // Wrapped: the shader multiplies the seed by 517, and a raw
      // seconds-since-load value loses its low bits within a few minutes,
      // which freezes the grain into a fixed pattern.
      context.uniform1f(uniforms.grainT, t % 1)
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
    },

    dispose() {
      context.deleteProgram(program)
      context.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    },
  }
}
