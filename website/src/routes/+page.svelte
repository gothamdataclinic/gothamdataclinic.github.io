<script lang="ts">
  import type { PageData } from './$types'
  import { uploadUrl, FALLBACK_IMAGES } from '$lib/cms'

  let { data }: { data: PageData } = $props()

  const fallbackPrograms = [
    { label: 'Neuroscience', title: 'BrainWaves', description: 'Our flagship program connecting EEG hardware to students\' computers, letting them observe their own brain activity and run real neuroscience experiments — the same way researchers do.' },
    { label: 'Data Science', title: 'Data Science Education', description: 'Hands-on workshops and curriculum teaching Python, machine learning, and AI to the next generation of NYC scientists and technologists.' },
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

  let heroHeadline = $derived(settings.heroHeadline || "Training Tomorrow's Data Scientists in the City That Never Stops")
  let heroSubhead = $derived(settings.missionStatement || 'Gotham Data Clinic is a New York City-based nonprofit whose mission is to train the next generation of scientists and technologists in computing and data science — and to engage the public in these vital conversations.')
  let heroImage = $derived(uploadUrl(settings.heroImage) || FALLBACK_IMAGES.heroBg)
  let missionSectionBody = $derived(settings.missionSectionBody || 'Our vision is to inform, prepare, and train the next generation of scientists and technologists — and the broader public — in computational and data sciences for a more fair and responsible future.')
  let visionQuote = $derived(settings.visionQuote || 'We wanted to find a home for this research platform and its curriculum after the grant period ended — so we established this nonprofit to be the stewards of the program.')
</script>

<svelte:head><title>Gotham Data Clinic</title></svelte:head>

<!-- HERO -->
<section class="hero" style="background-image:url('{heroImage}');">
  <div class="hero-overlay"></div>
  <div class="container hero-inner">
    <div class="hero-card">
      <span class="section-label fade-up">Our Mission</span>
      <h1 class="fade-up-1">{heroHeadline}</h1>
      <p class="fade-up-2">{heroSubhead}</p>
      <div class="btns fade-up-3">
        <a href="/about" class="btn-ember">Explore Our Programs →</a>
        <a href="/donate" class="btn-outline-white">Support Our Work</a>
      </div>
    </div>
  </div>
</section>

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
<section class="sec-white">
  <div class="container two-col">
    <div>
      <span class="section-label">Our Mission</span>
      <h2>Advancing the frontiers of computational and data science education</h2>
      <p class="body">{missionSectionBody}</p>
      <blockquote class="ember-border" style="margin: 1.5rem 0;">
        <p class="body" style="font-style:italic;">"{visionQuote}"</p>
      </blockquote>
      <a href="/about" class="tlink">Read Our Full Story →</a>
    </div>
    <img src={FALLBACK_IMAGES.missionVisual} alt="Data science visualization" class="sec-img" style="box-shadow: 8px 8px 0 #D9581F;" />
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
      <div><span class="section-label">Events &amp; Lectures</span><h2 style="margin-bottom:0;">Upcoming Events</h2></div>
      <a href="/events" class="tlink">View All Events →</a>
    </div>
    <div class="two-col">
      {#if featuredEvent}
        <div class="event-card card-hover">
          <img src={uploadUrl(featuredEvent.image) || FALLBACK_IMAGES.brainwaves} alt="Event" class="ev-img" />
          <div class="ev-body">
            <span class="section-label">Featured Event</span>
            <h3 style="color:white;">{featuredEvent.title}</h3>
            {#if featuredEvent.description}
              <p style="color:rgba(255,255,255,0.65);font-size:0.875rem;line-height:1.6;margin-bottom:1.5rem;">{featuredEvent.description}</p>
            {/if}
            <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
              {#if featuredEvent.registrationUrl}
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
          <img src={FALLBACK_IMAGES.brainwaves} alt="Event" class="ev-img" />
          <div class="ev-body">
            <span class="section-label">No Upcoming Events</span>
            <h3 style="color:white;">Check back soon</h3>
            <p style="color:rgba(255,255,255,0.65);font-size:0.875rem;line-height:1.6;">New events are added regularly — add one in the CMS to feature it here.</p>
          </div>
        </div>
      {/if}
      <div class="research-panel">
        <img src={FALLBACK_IMAGES.programsNetwork} alt="Research" class="rp-img" />
        <div class="rp-overlay">
          <span class="section-label">Our Research</span>
          <h3 style="color:white;">Data Science for a Fair Future</h3>
          <p style="color:rgba(255,255,255,0.65);font-size:0.875rem;">We publish our work through scholarly and public engagements to advance responsible computing education.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- DONATE CTA -->
<section class="donate-cta">
  <div class="container two-col" style="align-items:center;">
    <div>
      <span class="section-label" style="color:#D9581F;">Support Our Work</span>
      <h2 style="color:white;">Help us train the next generation of NYC data scientists</h2>
    </div>
    <div>
      <p style="color:rgba(255,255,255,0.65);font-size:1rem;line-height:1.7;margin-bottom:2rem;">Your tax-deductible donation directly funds workshops, curriculum development, and public engagement programs that bring computational science to students across New York City.</p>
      <a href="/donate" class="btn-ember">Donate Now →</a>
    </div>
  </div>
</section>

<style>
.hero { position:relative; min-height:100vh; display:flex; align-items:flex-end; padding-bottom:5rem; background-size:cover; background-position:center top; background-repeat:no-repeat; }
.hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(19,27,46,.5) 0%,rgba(19,27,46,.7) 50%,rgba(19,27,46,.88) 100%); }
.hero-inner { position:relative; z-index:10; width:100%; }
.hero-card { max-width:580px; padding:2.5rem; background:rgba(19,27,46,.85); backdrop-filter:blur(6px); border-left:3px solid #D9581F; }
.hero-card h1 { font-size:clamp(1.75rem,4vw,3rem); font-weight:800; color:white; line-height:1.2; margin-bottom:1rem; }
.hero-card p { font-size:1rem; color:rgba(255,255,255,.75); line-height:1.7; margin-bottom:2rem; }
.btns { display:flex; flex-wrap:wrap; gap:1rem; }
.btn-ember { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1.5rem; background:#D9581F; color:white; font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; transition:background .2s; }
.btn-ember:hover { background:#bf4a16; }
.btn-outline-white { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1.5rem; border:2px solid white; color:white; font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; transition:all .2s; }
.btn-outline-white:hover { background:white; color:#1D2B4A; }
.tlink { font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#1D2B4A; border-bottom:2px solid #D9581F; padding-bottom:2px; transition:color .2s; }
.tlink:hover { color:#D9581F; }
.stats-bar { background:#3D4A73; padding:2rem 0; }
.stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
@media(min-width:1024px){.stats-grid{grid-template-columns:repeat(4,1fr);}}
.stat { text-align:center; }
.stat-val { font-size:1.875rem; font-weight:800; color:white; }
.stat-lbl { font-size:.7rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-top:.25rem; }
.sec-white { background:#fff; padding:5rem 0; }
.sec-canvas { background:#F3F5FA; padding:5rem 0; }
.two-col { display:grid; gap:3rem; }
@media(min-width:1024px){.two-col{grid-template-columns:1fr 1fr; gap:5rem;}}
.four-col { display:grid; gap:1.5rem; margin-top:3rem; }
@media(min-width:640px){.four-col{grid-template-columns:repeat(2,1fr);}}
@media(min-width:1024px){.four-col{grid-template-columns:repeat(4,1fr);}}
.sec-hdr { display:flex; flex-direction:column; gap:1rem; margin-bottom:3rem; }
@media(min-width:640px){.sec-hdr{flex-direction:row; align-items:flex-end; justify-content:space-between;}}
h2 { font-size:clamp(1.5rem,3vw,2.25rem); font-weight:800; color:#1D2B4A; line-height:1.25; margin-bottom:1.5rem; }
h3 { font-size:1.125rem; font-weight:700; color:#1D2B4A; margin-bottom:.75rem; }
.body { font-size:1rem; line-height:1.7; color:#3D4A73; }
.sm-body { font-size:.875rem; line-height:1.6; color:#3D4A73; }
.sec-img { width:100%; height:22rem; object-fit:cover; }
.prog-card { padding:1.5rem; border:1px solid #DDE2EE; background:white; }
.event-card { background:#1D2B4A; overflow:hidden; }
.ev-img { width:100%; height:13rem; object-fit:cover; opacity:.5; }
.ev-body { padding:2rem; }
.research-panel { position:relative; overflow:hidden; min-height:16rem; }
.rp-img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
.rp-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:2rem; background:linear-gradient(to top,rgba(19,27,46,.92) 0%,rgba(19,27,46,.4) 60%,transparent 100%); }
.donate-cta { background:#1D2B4A; padding:5rem 0; }
</style>
