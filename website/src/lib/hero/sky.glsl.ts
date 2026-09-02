/**
 * Gotham Data Clinic — hero sky shader
 *
 * One WebGL2 program, one full-screen triangle pair. No scene graph, no
 * geometry, no dependency: the sky is a function of the view ray.
 *
 * Composition order in the fragment stage:
 *   1. reconstruct a view ray from the pixel, then rotate it by the cursor
 *      parallax — the sky turns with the camera instead of sliding, so the
 *      horizon can never shear
 *   2. gradient from horizon to zenith
 *   3. the warm band, biased toward the sun's azimuth
 *   4. sun/moon glow, moon disc, star field
 *   5. one advected cloud deck on a plane, with a clearing behind the hero card
 *   6. ACES tonemap, vignette, film grain, then the sRGB transfer
 */

export const VERT = /* glsl */ `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // Two triangles from three verts: the classic oversized-triangle trick, but
  // as a strip of four so the UVs stay in 0..1 without extra maths.
  vec2 p = vec2((gl_VertexID & 1) == 0 ? -1.0 : 3.0, (gl_VertexID & 2) == 0 ? -1.0 : 3.0);
  vUv = (p + 1.0) * 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`

export const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;

// Camera. uLook is (pitch, yaw) in radians, already including the base tilt.
uniform vec2  uLook;
uniform float uTanHalfFov;

// Palette, pre-blended on the CPU: three looks crossfade there, so the shader
// only ever handles one set of colours.
uniform vec3  uZenith;
uniform vec3  uHorizon;
uniform vec3  uBand;
uniform float uBandK;
uniform vec3  uGlow;
uniform vec3  uSunDir;
uniform float uStarK;
uniform float uMoonK;
uniform float uCover;
uniform vec3  uCloudLit;
uniform vec3  uCloudShadow;
uniform float uExposure;

// Hero-card rectangle in UV space (x0, y0, x1, y1), and how far its calming
// influence reaches. Zero-area disables it.
uniform vec4  uShelter;
uniform float uShelterReach;

// Film grain seed. Held constant under prefers-reduced-motion so the frame is
// genuinely still rather than hissing in place.
uniform float uGrainT;

// The real moon is 0.26deg of angular radius, which at this field of view is
// about five pixels — too small to read as anything. This is the smallest size
// that still shows a limb and its maria at hero scale.
const float MOON_ANGULAR_RADIUS = 0.0075;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0, amp = 0.5;
  // Rotate between octaves: without it the lattice lines up and the deck reads
  // as a grid of blobs rather than as weather.
  const mat2 R = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    sum += amp * valueNoise(p);
    p = R * p * 2.02;
    amp *= 0.5;
  }
  return sum;
}

/** Signed distance to the hero card, rounded to a lozenge. Negative inside. */
float shelterDist(vec2 uv) {
  if (uShelter.z <= uShelter.x) return 1e3;
  // Measured in frame heights on both axes, so the clearing extends as far to
  // the sides of the card as it does above it. In raw UV fractions a wide
  // viewport spread it half again as far sideways.
  float ar = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * ar, uv.y);
  vec2 lo = vec2(uShelter.x * ar, uShelter.y);
  vec2 hi = vec2(uShelter.z * ar, uShelter.w);
  vec2 c = 0.5 * (lo + hi), h = 0.5 * (hi - lo);
  float rad = min(min(h.x, h.y), 0.12);
  vec2 d = abs(p - c) - (h - rad);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - rad;
}

void main() {
  // ── 1. view ray ──────────────────────────────────────────────────────────
  vec2 ndc = vUv * 2.0 - 1.0;
  ndc.x *= uRes.x / uRes.y;
  vec3 dir = normalize(vec3(ndc * uTanHalfFov, -1.0));

  float cp = cos(uLook.x), sp = sin(uLook.x);
  float cy = cos(uLook.y), sy = sin(uLook.y);
  dir = vec3(dir.x, cp * dir.y - sp * dir.z, sp * dir.y + cp * dir.z); // pitch
  dir = vec3(cy * dir.x + sy * dir.z, dir.y, -sy * dir.x + cy * dir.z); // yaw

  vec3 sun = normalize(uSunDir);

  // ── 2. gradient ──────────────────────────────────────────────────────────
  float h = smoothstep(-0.06, 0.6, dir.y);
  vec3 col = mix(uHorizon, uZenith, pow(h, 0.85));

  // ── 3. the warm band ─────────────────────────────────────────────────────
  // The colour lives NEAR THE SUN: overhead stays blue, the band hugs the
  // rooftops and builds toward the sun's azimuth.
  vec3 sunH = normalize(vec3(sun.x, 0.0, sun.z) + 1e-5);
  vec3 dirH = normalize(vec3(dir.x, 0.0, dir.z) + 1e-5);
  float az = smoothstep(-0.5, 1.0, dot(dirH, sunH));
  float low = smoothstep(0.18, -0.05, dir.y);
  col = mix(col, uBand, uBandK * low * (0.30 + 0.70 * az));

  // ── 4. sun, moon, stars ──────────────────────────────────────────────────
  float sd = max(dot(dir, sun), 0.0);
  col += uGlow * pow(sd, 14.0) * 0.24;
  col += uGlow * pow(sd, 4.0) * 0.09 * uBandK; // the low golden haze at sunrise

  if (uStarK > 0.001) {
    // One candidate star per ~0.5deg cell of an azimuth/elevation grid: most
    // faint, a few bright, all twinkling. Pin-points with a core a pixel or
    // two across, the brightest carrying a faint skirt — discs read as dust.
    vec2 ae = vec2(atan(dir.x, -dir.z), asin(clamp(dir.y, -1.0, 1.0))) * 114.6;
    vec2 cell = floor(ae);
    vec2 f = fract(ae) - 0.5;
    float hs = hash13(vec3(cell, 1.0));
    vec2 off = vec2(hash13(vec3(cell, 7.3)), hash13(vec3(cell, 13.9))) - 0.5;
    float mag = fract(hs * 41.7);
    float rad = 0.028 + 0.035 * mag * mag;
    float dd = length(f - off * 0.7);
    float core = smoothstep(rad, rad * 0.25, dd);
    float skirt = smoothstep(rad * 4.0, 0.0, dd) * 0.08 * mag * mag;
    float twinkle = 0.72 + 0.28 * sin(uTime * (1.1 + 2.3 * mag) + hs * 40.0);
    // Thin them out toward the horizon, where haze and the city's own light
    // would have eaten them long before they reached us.
    float alt = smoothstep(0.02, 0.34, dir.y);
    col += vec3(0.86, 0.90, 1.0) * (core * mag * mag * 1.5 + skirt) * twinkle * alt * uStarK;
  }

  if (uMoonK > 0.001) {
    float ang = acos(clamp(sd, -1.0, 1.0));
    float edge = ang / MOON_ANGULAR_RADIUS;
    // The limb dissolves rather than cutting: a hard-edged disc at this size
    // reads as a sticker pasted on the sky.
    float disc = smoothstep(1.0, 0.72, edge);
    // Maria, as low-frequency mottle, so it is a body and not a dot.
    vec2 mp = (dir.xy - sun.xy) / MOON_ANGULAR_RADIUS;
    float detail = 0.82 + 0.18 * fbm(mp * 2.4 + 11.0);
    col = mix(col, vec3(0.95, 0.93, 0.86) * detail, disc * uMoonK);
  }

  // ── 5. clouds ────────────────────────────────────────────────────────────
  if (uCover > 0.001) {
    // Cloud deck as a plane, but with the ray parameter softened by a constant
    // rather than the textbook 1/dir.y. Two failures got me here:
    //
    //   - Pure 1/dir.y sends the sampling rate to infinity at the horizon, and
    //     five octaves of noise at infinite frequency average to flat grey. The
    //     bottom half of the sky came out milky.
    //   - Clamping the ray and shrinking the scale to compensate left the
    //     visible sky spanning well under one noise cell horizontally, so the
    //     deck varied only with altitude: banding, not weather.
    //
    // +0.28 bounds the compression at the horizon while leaving the visible
    // window several cells wide in both axes, which is what reads as a deck
    // receding into the distance.
    float t = 1.0 / (dir.y + 0.28);
    vec2 p = dir.xz * t * 1.5 + vec2(uTime * 0.0035, uTime * 0.0012);
    float d = fbm(p);

    // fbm here is mean 0.52, sd 0.13. The threshold is placed so the band
    // straddles the median — that is what decides whether the deck has edges
    // or dissolves into haze, so it is measured rather than guessed.
    float thr = mix(0.56, 0.32, uCover);
    float cover = smoothstep(thr, thr + 0.22, d);
    // Clear air just above the rooftops: the deck fading in higher up is what
    // lets the skyline's silhouette read against flat colour instead of noise.
    cover *= smoothstep(0.03, 0.20, dir.y);

    // Keep the deck calm behind the hero card. This is legibility as a
    // property of the render — it lets the card's own scrim stay light.
    float sh = shelterDist(vUv);
    cover *= 1.0 - 0.88 * (1.0 - smoothstep(0.0, uShelterReach, max(sh, 0.0)));

    // Light the deck off the noise field itself: the thick cores sit in their
    // own shadow, and the sun burns through where the deck runs thin.
    float lit = smoothstep(thr, thr + 0.34, d);
    vec3 cloud = mix(uCloudShadow, uCloudLit, lit);
    cloud += uGlow * pow(sd, 26.0) * 0.45 * (1.0 - cover * 0.7);
    col = mix(col, cloud, clamp(cover, 0.0, 1.0));
  }

  // ── 6. finish ────────────────────────────────────────────────────────────
  col *= uExposure;
  col = clamp((col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14), 0.0, 1.0); // ACES

  float vig = 1.0 - smoothstep(0.42, 0.92, distance(vUv, vec2(0.5))) * 0.16;
  col *= vig;

  // Grain, but not in the blacks: added flat it drives near-black below zero
  // and the clamp then flips those pixels between black and dark grey at
  // random, which shows up as hard speckle over the darkest sky. Film grain is
  // multiplicative in the darks anyway.
  float g = hash12(vUv * 913.0 + uGrainT * 517.0) - 0.5;
  col += g * 0.024 * (0.15 + 0.85 * smoothstep(0.0, 0.1, dot(col, vec3(0.3333))));

  fragColor = vec4(pow(max(col, 0.0), vec3(1.0 / 2.2)), 1.0);
}
`
