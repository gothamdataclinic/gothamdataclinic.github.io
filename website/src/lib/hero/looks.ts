/**
 * Gotham Data Clinic — hero sky looks
 *
 * Three times of day over the Manhattan skyline. The palettes are not
 * arbitrary: they are the brand tokens (see app.css) read as a sky.
 *
 *   Night   — ink/navy zenith, with ember low over the rooftops. That band is
 *             light pollution, which is what the sky over midtown actually
 *             looks like at 3am.
 *   Day     — the blue between navy and white.
 *   Sunrise — ember, where it lives naturally.
 *
 * Colours here drive the WebGL sky only. The matching grade applied to the
 * skyline photograph is a CSS filter, and lives in SkyHero.svelte next to the
 * element it filters — different rendering domain, different place.
 */

export const LOOK_IDS = ['night', 'day', 'sunrise'] as const
export type LookId = (typeof LOOK_IDS)[number]

export function isLookId(value: unknown): value is LookId {
  return typeof value === 'string' && (LOOK_IDS as readonly string[]).includes(value)
}

/** Linear-sRGB triple, 0..1. The shader works in linear light and tonemaps at the end. */
export type Rgb = readonly [number, number, number]

export interface Look {
  readonly id: LookId
  /** Button label, and the accessible name of the swatch. */
  readonly label: string
  /** Swatch fill. Reads as the look at a glance, so it is a mid-tone of the sky, not the zenith. */
  readonly swatch: string
  /** Straight overhead. */
  readonly zenith: Rgb
  /** At the horizon, away from the sun. */
  readonly horizon: Rgb
  /** The warm/lit band that hugs the skyline, strongest toward the sun's azimuth. */
  readonly band: Rgb
  /** How strongly `band` takes over near the horizon, 0..1. */
  readonly bandK: number
  /** Colour of the glow around the sun (or moon). Can exceed 1 — it is a light, not a surface. */
  readonly glow: Rgb
  /** View-space direction to the sun or moon; -z is into the screen. Normalized on load. */
  readonly sunDir: Rgb
  /** Star field brightness, 0..1. */
  readonly starK: number
  /** Moon disc opacity, 0..1. */
  readonly moonK: number
  /** Cloud coverage, 0..1. */
  readonly cover: number
  /** Sunlit cloud crown. */
  readonly cloudLit: Rgb
  /** Cloud underside. */
  readonly cloudShadow: Rgb
  /** Pre-tonemap exposure. */
  readonly exposure: number
}

const srgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16)
  const to = (byte: number) => {
    const c = byte / 255
    // sRGB EOTF. Doing it here means the shader can blend and light in linear
    // space, which is the only way the sunrise band mixes without going muddy.
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return [to((n >> 16) & 255), to((n >> 8) & 255), to(n & 255)]
}

const scale = (c: Rgb, k: number): Rgb => [c[0] * k, c[1] * k, c[2] * k]

export const LOOKS: Readonly<Record<LookId, Look>> = {
  night: {
    id: 'night',
    label: 'Night',
    swatch: '#1A2237',
    zenith: srgb('#0B1226'),
    horizon: srgb('#1D2B4A'), // --navy
    band: scale(srgb('#D9581F'), 0.5), // --ember, as light pollution
    bandK: 0.36,
    // Kept dim on purpose: this same term is the sun's glow by day, and at
    // night it is a moon halo. Any brighter and its 20-degree falloff greys
    // the whole upper sky into haze instead of leaving it deep.
    glow: scale(srgb('#9FB0D4'), 0.26),
    sunDir: [-0.46, 0.4, -0.79], // moon, upper left
    starK: 1,
    moonK: 1,
    cover: 0.28,
    cloudLit: scale(srgb('#5E6E92'), 0.5),
    cloudShadow: scale(srgb('#141C33'), 0.8),
    exposure: 1.12,
  },
  day: {
    id: 'day',
    label: 'Day',
    swatch: '#7EA9DE',
    zenith: srgb('#3F63A8'),
    horizon: srgb('#7FA3D4'),
    band: srgb('#C3D6EE'),
    bandK: 0.2,
    glow: scale(srgb('#FFE9C4'), 1.25),
    sunDir: [0.54, 0.62, -0.57], // upper right, out of frame
    starK: 0,
    moonK: 0,
    cover: 0.4,
    cloudLit: scale(srgb('#FFFFFF'), 1.18),
    cloudShadow: srgb('#9BB0CE'),
    exposure: 1,
  },
  sunrise: {
    id: 'sunrise',
    label: 'Sunrise',
    swatch: '#E59558',
    zenith: srgb('#4A6CAB'),
    horizon: srgb('#E59558'),
    band: scale(srgb('#FFB871'), 1.1),
    bandK: 0.85,
    glow: scale(srgb('#FFB871'), 1.5),
    sunDir: [0.6, 0.055, -0.8], // low right, sitting on the rooftops
    starK: 0,
    moonK: 0,
    cover: 0.45,
    cloudLit: scale(srgb('#FFD3A6'), 1.1),
    cloudShadow: srgb('#8E7E96'),
    exposure: 1.04,
  },
}

/**
 * The look a first-time visitor gets: whatever it is outside their window.
 * A returning visitor's explicit choice is restored instead (see SkyHero).
 */
export function lookByClock(now = new Date()): LookId {
  const h = now.getHours()
  if (h >= 5 && h < 8) return 'sunrise'
  if (h >= 8 && h < 18) return 'day'
  return 'night'
}
