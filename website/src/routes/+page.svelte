<script lang="ts">
  import type { PageData } from './$types'
  import { uploadUrl } from '$lib/cms'
  import { isLookId } from '$lib/hero/looks'
  import SkyHero from '$lib/components/SkyHero.svelte'

  let { data }: { data: PageData } = $props()

  const fallbackPrograms = [
    { label: 'Neuroscience', title: 'BrainWaves', description: 'Our flagship program connecting EEG hardware to students\' computers, letting them observe their own brain activity and run real neuroscience experiments — the same way researchers do.' },
    { label: 'Data Science', title: 'Data Science Education', description: 'Hands-on workshops and curriculum teaching Python, machine learning, and AI to the next generation of scientists and technologists.' },
    { label: 'Community', title: 'Public Engagement', description: 'We bring computational science to the broader public through lectures, events, and scholarly publications that make complex ideas accessible.' },
    { label: 'Curriculum', title: 'Open Curriculum', description: 'We develop and freely share next-generation educational content and platforms for computing and data science, built for NYC\'s diverse student population.' },
  ]
  const fallbackStats = [
    { value: '30+', label: 'NYC High Schools Reached' },
    { value: '501(c)(3)', label: 'Nonprofit Organization' },
    { value: '2019', label: 'Year Founded' },
    { value: 'NYC', label: 'Based in New York City' },
  ]

  let settings = $derived(data.settings ?? {})
  let programs = $derived(data.programs?.length ? data.programs : fallbackPrograms)
  let stats = $derived(settings.orgStats?.length ? settings.orgStats : fallbackStats)
  let featuredEvent = $derived(data.featuredEvent)
  let isPastEvent = $derived(data.isPastEvent)

  let heroHeadline = $derived(settings.heroHeadline || 'Training the next-generation of scientists and technologists')
  let heroSubhead = $derived(settings.missionStatement || 'Gotham Data Clinic is a New York City-based nonprofit whose mission is to train the next generation of scientists and technologists in computing and data science — and to engage the public in these vital conversations.')
  // 'auto' (and an unset field) means the hero picks by the visitor's clock,
  // which SkyHero does when it gets no `look`.
  let heroLook = $derived(isLookId(settings.heroDefaultLook) ? settings.heroDefaultLook : undefined)
  let heroPlate = $derived(uploadUrl(settings.heroSkylinePlate))
  let missionSectionBody = $derived(settings.missionSectionBody || 'Our vision is to inform, prepare, and train the next generation of scientists and technologists — and the broader public — in computational and data sciences for a more fair and responsible future.')
  let visionQuote = $derived(settings.visionQuote || 'We wanted to find a home for this neuroscience education platform and its curriculum after the grant period ended so we established this nonprofit to be the stewards of the program.')
</script>

<svelte:head>
  <title>Gotham Data Clinic</title>
  <meta property="og:title" content="Gotham Data Clinic" />
  <meta property="og:url" content="https://gothamdataclinic.org/" />
  <meta name="twitter:title" content="Gotham Data Clinic" />
</svelte:head>

<!-- HERO -->
<SkyHero
  look={heroLook}
  plate={heroPlate}
  creditText={settings.heroPhotoCredit?.text ?? 'Photo by Michael Discenza on Unsplash'}
  creditHref={settings.heroPhotoCredit?.url ??
    'https://unsplash.com/photos/landscape-photo-of-new-york-empire-state-building-5omwAMDxmkU'}
>
  <div class="sky-hero-card">
    <span class="section-label fx-el" style="--fx-order: 0;">Our Mission</span>
    <h1 class="fx-title" style="--fx-order: 1;">{heroHeadline}</h1>
    <p class="fx-el" style="--fx-order: 2;">{heroSubhead}</p>
    <div class="btns fx-el" style="--fx-order: 3;">
      <a href="/about" class="btn-ember">Explore Our Programs →</a>
      <a href="/donate" class="btn-outline-white">Support Our Work</a>
    </div>
  </div>
</SkyHero>

<!-- STATS -->
<section class="stats-bar">
  <div class="container stats-grid">
    {#each stats as s}
      <div class="stat">
        <div class="stat-val">{s.value}</div>
        <div class="stat-lbl">{s.label}</div>
      </div>
    {/each}
  </div>
</section>

<!-- MISSION -->
<section class="mission-section">
  <div class="container mission-layout">
    <div class="mission-heading">
      <span class="section-label">Our Mission</span>
      <h2>Advancing the frontiers of computing and data science education</h2>
    </div>
    <div class="mission-body">
      <p class="body">{missionSectionBody}</p>
      <a href="/about" class="tlink">Read Our Full Story →</a>
    </div>
    <blockquote class="mission-quote">
      <span class="quote-mark" aria-hidden="true">“</span>
      <p>{visionQuote}</p>
    </blockquote>
  </div>
</section>

<!-- PROGRAMS -->
<section class="sec-canvas">
  <div class="container">
    <div class="sec-hdr">
      <div><span class="section-label">Program Areas</span><h2 style="margin-bottom:0;">What We Do</h2></div>
      <a href="/about" class="tlink">About Us →</a>
    </div>
    <div class="four-col">
      {#each programs as p}
        <div class="prog-card card-hover">
          <span class="section-label">{p.label}</span>
          <h3>{p.title}</h3>
          <p class="sm-body">{p.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- EVENTS -->
<section class="sec-white">
  <div class="container">
    <div class="sec-hdr">
      <div><span class="section-label">Events &amp; Lectures</span><h2 style="margin-bottom:0;">Our Events</h2></div>
      <a href="/events" class="tlink">View All Events →</a>
    </div>
    <div class="events-single">
      {#if featuredEvent}
        <div class="event-card card-hover">
          {#if uploadUrl(featuredEvent.image, 'card')}
            <img src={uploadUrl(featuredEvent.image, 'card')} alt="Event" class="ev-img" loading="lazy" />
          {/if}
          <div class="ev-body">
            <span class="section-label">{isPastEvent ? 'Past Event' : 'Featured Event'}</span>
            <h3 style="color:white;">{featuredEvent.title}</h3>
            {#if featuredEvent.description}
              <p style="color:rgba(255,255,255,0.65);font-size:0.875rem;line-height:1.6;margin-bottom:1.5rem;">{featuredEvent.description}</p>
            {/if}
            <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
              {#if featuredEvent.registrationUrl && !isPastEvent}
                <a href={featuredEvent.registrationUrl} target="_blank" rel="noopener" class="btn-ember">Register Now →</a>
              {/if}
              {#if featuredEvent.websiteUrl}
                <a href={featuredEvent.websiteUrl} target="_blank" rel="noopener" style="color:white;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-bottom:2px solid #D9581F;padding-bottom:2px;">Event Website →</a>
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="event-card card-hover">
          <div class="ev-body">
            <span class="section-label">No Events Yet</span>
            <h3 style="color:white;">Check back soon</h3>
            <p style="color:rgba(255,255,255,0.65);font-size:0.875rem;line-height:1.6;">New events are added regularly — add one in the CMS to feature it here.</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- DONATE CTA -->
<section class="donate-cta">
  <div class="container two-col" style="align-items:center;">
    <div>
      <span class="section-label" style="color:#D9581F;">Support Our Work</span>
      <h2 style="color:white;">Help us train the next generation of scientists and technologists</h2>
    </div>
    <div>
      <p style="color:rgba(255,255,255,0.65);font-size:1rem;line-height:1.7;margin-bottom:2rem;">Your tax-deductible donation directly funds workshops, curriculum development, and public engagement programs that bring computational science to students across New York City.</p>
      <a href="/donate" class="btn-ember">Donate Now →</a>
    </div>
  </div>
</section>

<style>
/* The hero's own chrome (sky, plate, swatches) lives in SkyHero.svelte. What
   stays here is the copy card, because the copy is authored here and Svelte
   scopes styles to the component the markup is written in.

   The scrim is deliberately lighter than the flat photo hero it replaces: the
   sky shader thins its cloud deck behind this card (see uShelter), so the type
   already has somewhere quiet to sit. */
.sky-hero-card { max-width:580px; padding:2.5rem; background:var(--scrim-card, rgba(19,27,46,.7)); backdrop-filter:blur(8px); border-left:3px solid #D9581F; transition:background 450ms linear; }
.sky-hero-card h1 { font-size:clamp(1.75rem,4vw,3rem); font-weight:800; color:white; line-height:1.2; margin-bottom:1rem; text-shadow:0 4px 16px rgba(20,40,70,.28); }
.sky-hero-card p { font-size:1rem; color:rgba(255,255,255,.82); line-height:1.7; margin-bottom:2rem; }
/* The site-wide .section-label is full ember, which sits at 2.3:1 over the
   card once the card is floating on a bright daytime sky — the flat-photo hero
   this replaces got away with it only because it had a second full-hero scrim
   darkening everything underneath. Ember lightened to #FFB185 measures
   5.1:1 (day), 5.1:1 (sunrise) and 7.8:1 (night) against the rendered card,
   so the accent survives without dulling the sky to pay for it. */
.sky-hero-card .section-label { color:#FFB185; }
.btns { display:flex; flex-wrap:wrap; gap:1rem; }
.btn-ember { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1.5rem; background:#D9581F; color:white; font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; transition:background .2s; }
.btn-ember:hover { background:#bf4a16; }
.btn-outline-white { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1.5rem; border:2px solid white; color:white; font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; transition:all .2s; }
.btn-outline-white:hover { background:white; color:#1D2B4A; }
/* On a phone the card was eating ~71% of the hero: the sky and the skyline —
   the entire point of it — were reduced to slivers above and below a wall of
   copy. Tightening the padding and type here reclaims roughly 130px of
   vertical space, which is what puts the Empire State spire back in open sky
   above the card. */
@media (max-width: 639px) {
  .sky-hero-card { padding:1.75rem; }
  .sky-hero-card h1 { font-size:clamp(1.5rem,6.6vw,2rem); margin-bottom:.75rem; }
  .sky-hero-card p { font-size:.9375rem; line-height:1.6; margin-bottom:1.5rem; }
  .btns { gap:.75rem; }
}
.tlink { font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#1D2B4A; border-bottom:2px solid #D9581F; padding-bottom:2px; transition:color .2s; }
.tlink:hover { color:#D9581F; }
.stats-bar { background:#3D4A73; padding:2rem 0; }
.stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
@media(min-width:1024px){.stats-grid{grid-template-columns:repeat(4,1fr);}}
.stat { text-align:center; }
.stat-val { font-size:1.875rem; font-weight:800; color:white; }
.stat-lbl { font-size:.7rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-top:.25rem; }
.four-col { display:grid; gap:1.5rem; margin-top:3rem; }
@media(min-width:640px){.four-col{grid-template-columns:repeat(2,1fr);}}
@media(min-width:1024px){.four-col{grid-template-columns:repeat(4,1fr);}}
.sec-hdr { display:flex; flex-direction:column; gap:1rem; margin-bottom:3rem; }
@media(min-width:640px){.sec-hdr{flex-direction:row; align-items:flex-end; justify-content:space-between;}}
h2 { font-size:clamp(1.5rem,3vw,2.25rem); font-weight:800; color:#1D2B4A; line-height:1.25; margin-bottom:1.5rem; }
h3 { font-size:1.125rem; font-weight:700; color:#1D2B4A; margin-bottom:.75rem; }
.body { font-size:1rem; line-height:1.7; color:#3D4A73; }
.mission-section { background:linear-gradient(135deg, #fff 0%, #fff 62%, #f3f5fa 62%, #f3f5fa 100%); padding:clamp(4rem,8vw,7rem) 0; }
.mission-layout { display:grid; gap:2.5rem; }
.mission-heading h2 { max-width:60rem; font-size:clamp(2rem,5vw,4.5rem); line-height:1.08; letter-spacing:-.035em; margin:0; }
.mission-body { max-width:42rem; }
.mission-body .body { font-size:clamp(1.0625rem,1.6vw,1.25rem); margin-bottom:2rem; }
.mission-quote { position:relative; padding:2.25rem 2rem 2rem; background:#1D2B4A; color:white; }
.mission-quote::after { content:''; position:absolute; right:0; bottom:0; width:5rem; height:.4rem; background:#D9581F; }
.mission-quote p { position:relative; font-size:clamp(1.125rem,2vw,1.5rem); font-weight:600; line-height:1.55; }
.quote-mark { position:absolute; top:.15rem; left:1rem; color:#D9581F; font-size:5rem; font-weight:800; line-height:1; opacity:.5; }
@media(min-width:900px){
  .mission-layout { grid-template-columns:minmax(0,1.2fr) minmax(20rem,.8fr); gap:3.5rem 5rem; align-items:start; }
  .mission-heading { grid-column:1 / -1; }
  .mission-body { padding-top:.75rem; }
}
.prog-card { padding:1.5rem; border:1px solid #DDE2EE; background:white; }
.events-single { max-width:40rem; }
.event-card { background:#1D2B4A; overflow:hidden; }
.ev-img { width:100%; height:13rem; object-fit:cover; opacity:.5; }
.ev-body { padding:2rem; }
.donate-cta { background:#1D2B4A; padding:5rem 0; }
</style>
