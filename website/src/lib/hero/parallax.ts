/**
 * Gotham Data Clinic — hero camera parallax
 *
 * Kept separate from the WebGL renderer on purpose: the renderer is loaded
 * with a dynamic import and may never arrive (no WebGL2, or a GPU that throws
 * on context creation), but the skyline plate still parallaxes in that case.
 * Both paths read this one tracker, so there is a single set of constants.
 *
 * Two things make the effect read as a camera rather than as a mouse-follow:
 *
 *   - The amplitude is tiny. 0.0045 rad of yaw at full deflection, which at a
 *     42deg vertical field of view is about 1.2% of the frame height. It is
 *     felt rather than seen; anything larger looks like a parallax gimmick.
 *   - It never stops. Two out-of-phase sines drift the view whether or not the
 *     cursor moves, so the hero is alive on a touch device and while reading.
 */

const BASE_PITCH = 0.22 // tilt up, which puts the horizon ~20% above the frame's bottom edge
const CURSOR_YAW = 0.0045
const CURSOR_PITCH = 0.00275
const DRIFT_YAW = 0.0022
const DRIFT_PITCH = 0.0018
const DAMPING = 3 // 1/s, so the view catches up to the cursor over ~1/3s

export interface ParallaxView {
  /** Radians, including the base tilt. */
  pitch: number
  /** Radians. */
  yaw: number
  /** Damped cursor position, -1..1, for driving the plate's CSS transform. */
  nx: number
  ny: number
}

export interface ParallaxTracker {
  readonly view: ParallaxView
  update: (dt: number, t: number) => void
  dispose: () => void
}

/**
 * @param reduced when set, the view is pinned to dead centre and no listener is
 *   attached at all — `prefers-reduced-motion` should mean a genuinely still
 *   frame, not a slower one.
 */
export function createParallax(host: HTMLElement, reduced: boolean): ParallaxTracker {
  const view: ParallaxView = { pitch: BASE_PITCH, yaw: 0, nx: 0, ny: 0 }
  let targetX = 0
  let targetY = 0

  const onPointerMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    // The listener is on the window so the sky keeps responding once the
    // cursor leaves the hero, but the deflection is clamped: without this,
    // reading further down the page swings the camera to its limit and holds
    // it there.
    targetX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
    targetY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
  }

  if (!reduced) window.addEventListener('pointermove', onPointerMove, { passive: true })

  return {
    view,
    update(dt, t) {
      if (reduced) return
      const k = 1 - Math.exp(-DAMPING * dt)
      view.nx += (targetX - view.nx) * k
      view.ny += (targetY - view.ny) * k
      view.yaw =
        (0.55 * Math.sin(0.062 * t) + 0.3 * Math.sin(0.151 * t + 2.1)) * DRIFT_YAW -
        view.nx * CURSOR_YAW
      view.pitch =
        BASE_PITCH +
        (0.5 * Math.sin(0.083 * t + 1.2) + 0.3 * Math.sin(0.19 * t)) * DRIFT_PITCH -
        view.ny * CURSOR_PITCH
    },
    dispose() {
      window.removeEventListener('pointermove', onPointerMove)
    },
  }
}
