<script lang="ts">
  /**
   * Gotham Data Clinic — animated hero
   *
   * A procedural sky behind a matted photograph of midtown. The sky is real
   * geometry-free WebGL, so it can genuinely be re-lit: a photograph can be
   * tinted but it cannot become night, which is why the sky and the skyline
   * are separate layers here.
   *
   * This component owns the only animation loop. The renderer is loaded with a
   * dynamic import and is allowed to never arrive — no WebGL2, or a driver
   * that throws — in which case the CSS gradient underneath is the sky and the
   * plate still parallaxes.
   */
  import { onMount, type Snippet } from 'svelte'

  import { LOOKS, LOOK_IDS, isLookId, lookByClock, type LookId } from '$lib/hero/looks'
  import { createParallax } from '$lib/hero/parallax'
  import type { SkyRenderer } from '$lib/hero/sky'

  const STORAGE_KEY = 'gdc:hero-look'
  /** ~33fps. The sky is a slow drift; a display-rate loop spends battery on nothing. */
  const FRAME_MS = 30

  /** The plate that ships with the build, as responsive variants. */
  const BUILTIN_PLATE = '/hero/skyline-1200.webp'

  let {
    /** Overrides the clock default, and any stored choice. */
    look: forcedLook,
    /**
     * A replacement skyline plate. MUST have its sky removed — the sky is
     * rendered behind it, so an unmasked photograph would simply cover it.
     * Falls back to the responsive plate that ships with the build.
     */
    plate = null,
    creditText = 'Photo by Michael Discenza on Unsplash',
    creditHref = 'https://unsplash.com/photos/landscape-photo-of-new-york-empire-state-building-5omwAMDxmkU',
    children,
  }: {
    look?: LookId
    plate?: string | null
    creditText?: string
    creditHref?: string
    children: Snippet
  } = $props()

  let host: HTMLElement
  let card: HTMLElement
  // Deliberately not seeded from `forcedLook` here: that would read the prop
  // during setup and freeze it. onMount resolves the real starting look, which
  // is client-only anyway (stored choice, then the visitor's clock).
  let look = $state<LookId>('day')
  let ready = $state(false)

  function choose(next: LookId) {
    look = next
    renderer?.setLook(next)
    if (!forcedLook) {
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Safari in private mode throws on write. The look still applies.
      }
    }
  }

  let renderer: SkyRenderer | null = null

  onMount(() => {
    // Resolved here rather than during setup because localStorage and the
    // clock are client-only, and the static build renders this shell at build
    // time in whatever timezone the CI runner happens to be in.
    if (forcedLook) look = forcedLook
    else {
      let stored: string | null = null
      try {
        stored = localStorage.getItem(STORAGE_KEY)
      } catch {
        stored = null
      }
      look = isLookId(stored) ? stored : lookByClock()
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const parallax = createParallax(host, reduced)

    let disposed = false
    let frame = 0
    let lastFrame = performance.now()
    let lastDraw = 0
    let visible = true
    let focused = !document.hidden

    const shelterOf = () => {
      const hostRect = host.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      if (hostRect.width === 0 || hostRect.height === 0) return null
      return {
        x0: (cardRect.left - hostRect.left) / hostRect.width,
        y0: (cardRect.top - hostRect.top) / hostRect.height,
        x1: (cardRect.right - hostRect.left) / hostRect.width,
        y1: (cardRect.bottom - hostRect.top) / hostRect.height,
      }
    }

    const tick = (now: number) => {
      if (disposed) return
      frame = requestAnimationFrame(tick)
      if (!visible || !focused) {
        // Keep the clock honest so resuming does not jump the drift forward.
        lastFrame = now
        return
      }
      if (now - lastDraw < FRAME_MS) return
      lastDraw = now

      const dt = Math.min((now - lastFrame) / 1000, 0.05)
      lastFrame = now
      parallax.update(dt, now / 1000)

      // The plate reads the same damped cursor value as the sky, one step
      // further forward, so the two layers slip against each other. Pure
      // rotation gives every depth the same apparent motion, which on a flat
      // photograph looks like a sticker sliding.
      host.style.setProperty('--hero-px', parallax.view.nx.toFixed(4))
      host.style.setProperty('--hero-py', parallax.view.ny.toFixed(4))

      if (renderer) {
        renderer.resize()
        renderer.render(parallax.view, now / 1000, dt)
        if (!ready) {
          ready = true
          renderer.canvas.classList.add('drawn')
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.15) visible = false
          else if (entry.intersectionRatio > 0.6) visible = true
        }
      },
      { threshold: [0, 0.1, 0.15, 0.6, 0.7] },
    )
    observer.observe(host)

    const onVisibility = () => {
      focused = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility, { passive: true })

    const resizeObserver = new ResizeObserver(() => renderer?.setShelter(shelterOf()))
    resizeObserver.observe(host)
    resizeObserver.observe(card)

    import('$lib/hero/sky')
      .then(({ createSkyRenderer }) => {
        if (disposed) return
        renderer = createSkyRenderer(host, look)
        if (!renderer) {
          host.dataset.heroFallback = 'true'
          ready = true
          return
        }
        renderer.resize()
        renderer.setShelter(shelterOf())
        if (reduced) {
          // One frame, then nothing: reduced motion should mean a still image.
          renderer.render(parallax.view, 0, 0)
          renderer.canvas.classList.add('drawn')
          ready = true
        }
        // No loop is started here — the tick below is already running and
        // picks the renderer up on its next frame. Starting one here too gave
        // two concurrent loops, which halved the frame budget and doubled the
        // GPU cost for no visible change.
      })
      .catch((err) => {
        console.error('SkyHero: sky renderer failed to load', err)
        host.dataset.heroFallback = 'true'
        ready = true
      })

    if (reduced) ready = true
    else frame = requestAnimationFrame(tick)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      parallax.dispose()
      renderer?.dispose()
      renderer = null
    }
  })
</script>

<section class="sky-hero" bind:this={host} data-look={look} data-fx-ready={ready ? '' : undefined}>
  <!-- The renderer prepends its canvas here. Until it draws, and forever if it
       never does, this gradient is the sky. -->
  <div class="sky-fallback" aria-hidden="true"></div>

  <div class="plate" aria-hidden="true" style="--plate-url: url('{plate ?? BUILTIN_PLATE}')">
    {#if plate}
      <img class="plate-photo" src={plate} alt="" fetchpriority="high" decoding="async" />
    {:else}
      <!-- The plate is sized by the taller axis (see .plate), so `sizes` has to
           say so. The breakpoint exists to cap what a phone downloads: a 3x
           handset resolves this to well over 2400px and would otherwise pull
           the desktop plate over cellular for no visible gain. -->
      <picture>
        <source
          media="(min-width: 900px)"
          srcset="/hero/skyline-1600.webp 1600w, /hero/skyline-2400.webp 2400w"
          sizes="max(100vw, 118vh)"
        />
        <img
          class="plate-photo"
          src={BUILTIN_PLATE}
          srcset="/hero/skyline-1200.webp 1200w, /hero/skyline-1600.webp 1600w"
          sizes="max(100vw, 118vh)"
          alt=""
          fetchpriority="high"
          decoding="async"
        />
      </picture>
    {/if}
    <!-- Masked by the plate's own alpha, so the grade lands on the buildings
         and never on the sky showing between them. The mask URL comes from the
         same --plate-url as the image above: if the two ever drift apart the
         tint grades the wrong pixels. Costs a cache hit, not a request. -->
    <span class="plate-grade"></span>
  </div>

  <div class="container hero-inner" bind:this={card}>
    {@render children()}
  </div>

  <div class="looks" role="group" aria-label="Time of day">
    {#each LOOK_IDS as id (id)}
      <button
        type="button"
        class="look"
        class:on={look === id}
        style="--sw: {LOOKS[id].swatch}"
        title={LOOKS[id].label}
        aria-pressed={look === id}
        onclick={() => choose(id)}>{LOOKS[id].label}</button
      >
    {/each}
  </div>

  {#if creditText}
    {#if creditHref}
      <a class="credit" href={creditHref} target="_blank" rel="noopener">{creditText}</a>
    {:else}
      <span class="credit">{creditText}</span>
    {/if}
  {/if}
</section>

<style>
  /* Per-look tokens. The sky's own colours live in looks.ts because the shader
     needs them in linear light; these are the CSS-side companions — the
     gradient that stands in for the sky before (or instead of) the canvas, and
     the grade applied to the photograph so the buildings agree with the sky. */
  .sky-hero[data-look='night'] {
    --sky-zenith: #0b1226;
    --sky-horizon: #1d2b4a;
    --sky-band: #2c2f43;
    --plate-filter: brightness(0.34) saturate(0.62) contrast(1.14);
    --plate-tint: rgba(29, 43, 74, 0.5);
    /* The card's own backdrop. Inherits into +page.svelte, where the card is
       authored, so the copy panel is tinted by the time of day too. */
    --scrim-card: rgba(19, 27, 46, 0.7);
  }
  .sky-hero[data-look='day'] {
    --sky-zenith: #3f63a8;
    --sky-horizon: #7fa3d4;
    --sky-band: #c3d6ee;
    --plate-filter: brightness(1.02) saturate(0.94) contrast(1.02);
    --plate-tint: rgba(127, 163, 212, 0.1);
    --scrim-card: rgba(19, 27, 46, 0.72);
  }
  .sky-hero[data-look='sunrise'] {
    --sky-zenith: #4a6cab;
    --sky-horizon: #e59558;
    --sky-band: #ffb871;
    --plate-filter: brightness(0.86) saturate(1.14) contrast(1.12);
    --plate-tint: rgba(217, 88, 31, 0.14);
    --scrim-card: rgba(38, 24, 34, 0.74);
  }

  .sky-hero {
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: 100svh;
    padding-bottom: 5rem;
    overflow: hidden;
    isolation: isolate;
    /* The three sky stops are registered as <color> in app.css, which is what
       lets the fallback gradient crossfade: an unregistered custom property
       flips instantly and the gradient would snap between looks. Matches the
       ~450ms the shader takes to ease its own palette. */
    transition:
      --sky-zenith 450ms linear,
      --sky-horizon 450ms linear,
      --sky-band 450ms linear,
      background-color 450ms linear;
    background-color: var(--sky-horizon);
  }

  .sky-fallback {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      180deg,
      var(--sky-zenith) 0%,
      var(--sky-horizon) 62%,
      var(--sky-band) 100%
    );
    /* The gradient itself is not interpolable; the transition above animates
       the colours it is built from, and this repaints as they move. */
  }

  .sky-hero :global(.sky-canvas) {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  .sky-hero :global(.sky-canvas.drawn) {
    opacity: 1;
  }

  .plate {
    position: absolute;
    left: 50%;
    z-index: 2;
    pointer-events: none;

    /* Sized by HEIGHT, not width, and hung below the fold.

       The source is a tight telephoto crop: at full viewport width its
       buildings are taller than the hero, which clipped the Empire State
       spire against the top edge and left almost no sky. Driving the size from
       the hero's height instead fixes the composition at every aspect ratio —
       roughly a quarter sky, the spire and the Chrysler in the upper third,
       the dense midtown mass across the bottom — and pays for it by cropping
       the sides on wide viewports, which costs nothing: the interesting
       silhouette is all in the middle.

       The 22svh of hang crops the foreground brownstones along the bottom,
       which is what pushes the skyline down far enough to open up the sky.
       104% of minimum width is the parallax overscan: the plate slides up to
       1.1% of its own width, so it has to start at least that much wider than
       the hero or the edge swings into view. */
    height: 108svh;
    width: 162svh; /* 108 * 3/2, the plate's own aspect */
    min-width: 104%;
    bottom: -22svh;

    transform: translate3d(
      calc(-50% + var(--hero-px, 0) * -1.1%),
      calc(var(--hero-py, 0) * -0.55%),
      0
    );
    will-change: transform;
  }

  .plate picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  .plate-photo {
    /* min-width can make the box wider than the plate's own aspect on short,
       wide viewports; cover keeps the buildings' proportions and crops instead
       of stretching them. Anchored to the bottom so any crop is taken out of
       the transparent sky above the skyline. */
    object-fit: cover;
    object-position: center bottom;
  }

  .plate-photo {
    width: 100%;
    height: 100%;
    display: block;
    filter: var(--plate-filter);
    transition: filter 450ms linear;
  }

  .plate-grade {
    position: absolute;
    inset: 0;
    background: var(--plate-tint);
    transition: background 450ms linear;
    /* cover/bottom mirrors the photo's object-fit above — any other pair and
       the tint drifts off the buildings it is supposed to be grading. */
    mask-image: var(--plate-url);
    mask-size: cover;
    mask-position: center bottom;
    mask-repeat: no-repeat;
    -webkit-mask-image: var(--plate-url);
    -webkit-mask-size: cover;
    -webkit-mask-position: center bottom;
    -webkit-mask-repeat: no-repeat;
  }

  .hero-inner {
    position: relative;
    z-index: 4;
    width: 100%;
  }

  .looks {
    position: absolute;
    left: 1rem;
    bottom: 1.5rem;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  @media (min-width: 640px) {
    .looks {
      left: 1.5rem;
    }
  }
  @media (min-width: 1024px) {
    .looks {
      left: 2rem;
    }
  }

  .look {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 1.5px solid rgba(255, 255, 255, 0.45);
    border-radius: 50%;
    background: var(--sw);
    /* The label stays in the accessibility tree; only its ink is removed. */
    font-size: 0;
    color: transparent;
    cursor: pointer;
    appearance: none;
    box-shadow: 0 1px 3px rgba(20, 40, 70, 0.16);
    transition:
      border-width 160ms,
      border-color 160ms,
      transform 160ms;
  }
  .look:hover {
    border-color: rgba(255, 255, 255, 0.85);
  }
  .look:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
  .look.on {
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.92);
    transform: scale(1.08);
  }
  @media (min-width: 900px) {
    .look {
      width: 18px;
      height: 18px;
    }
  }

  .credit {
    position: absolute;
    right: 1rem;
    bottom: 1.5rem;
    z-index: 5;
    font-size: 0.6875rem;
    color: rgba(255, 255, 255, 0.55);
    text-shadow: 0 1px 6px rgba(11, 18, 38, 0.5);
  }
  .credit:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  @media (prefers-reduced-motion: reduce) {
    .sky-hero,
    .sky-fallback,
    .plate-photo,
    .plate-grade,
    .look,
    .sky-hero :global(.sky-canvas) {
      transition: none;
    }
    .plate {
      /* Overscan is min-width, not a scale, so the still frame is the plate at
         its natural size — dead centre, no cursor offset. */
      transform: translate3d(-50%, 0, 0);
      will-change: auto;
    }
  }
</style>
