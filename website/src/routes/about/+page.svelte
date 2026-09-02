<script lang="ts">
  import type { PageData } from './$types'
  import { uploadUrl } from '$lib/cms'
  import ImpactIcon from '$lib/components/ImpactIcon.svelte'

  let { data }: { data: PageData } = $props()
  let settings = $derived(data.settings ?? {})

  const fallbackPillars = [
    { title: 'Develop Next-Gen Curriculum', description: "We create computational and data science education content and platforms designed for NYC's diverse student population, from high school through university." },
    { title: 'Lead Workshops & Training', description: 'We deliver hands-on workshops and training programs in computing and data science, meeting students and communities where they are.' },
    { title: 'Publicize Our Work', description: 'We share our research and programs through scholarly publications and public engagements, contributing to the broader conversation on responsible computing education.' },
  ]
  const pillarIcons = ['building', 'workshops', 'publishing'] as const
  const fallbackTimeline = [
    { label: 'The Beginning', description: 'Gotham Data Clinic was born out of a National Institutes of Health Science Education Partnership Award granted to NYU to develop and deliver a neuroscience curriculum to high school students in NYC.' },
    { label: 'BrainWaves Program', description: "We created a research platform connecting EEG hardware to students' computers, letting them observe their own brain activity. The BrainWaves curriculum reached thirty different high schools across New York City." },
    { label: 'Today & Beyond', description: 'After the NIH grant period ended, we established this nonprofit to be the stewards of the BrainWaves platform and to incubate new programs. We have since expanded to include data science, machine learning, and AI.' },
  ]
  const fallbackStats = [
    { value: '30+', label: 'High Schools' },
    { value: 'NYC', label: 'Based In' },
    { value: 'NIH', label: 'Original Funder' },
    { value: '501(c)(3)', label: 'Nonprofit Status' },
  ]

  let visionQuote = $derived(settings.visionQuote || 'We wanted to find a home for this neuroscience education platform and its curriculum after the grant period ended so we established this nonprofit to be the stewards of the program.')
  let visionIntro = $derived(settings.visionIntro || "We believe that access to computing education should not be determined by zip code or socioeconomic status. By bringing world-class computing and data science curriculum to NYC's public schools and beyond, we are helping to close the opportunity gap in STEM.")
  let pillars = $derived(settings.pillars?.length ? settings.pillars : fallbackPillars)
  let historyTimeline = $derived(settings.historyTimeline?.length ? settings.historyTimeline : fallbackTimeline)
  let stats = $derived(settings.orgStats?.length ? settings.orgStats : fallbackStats)
  let heroImage = $derived(uploadUrl(settings.aboutHeroImage))
  let missionFull = $derived(settings.missionFull)
  let missionVisualImage = $derived(uploadUrl(settings.missionVisualImage))
  let brainwavesImage = $derived(uploadUrl(settings.brainwavesImage))
</script>

<svelte:head>
  <title>About & Mission | Gotham Data Clinic</title>
  <meta property="og:title" content="About & Mission | Gotham Data Clinic" />
  <meta property="og:url" content="https://gothamdataclinic.org/about" />
  <meta name="twitter:title" content="About & Mission | Gotham Data Clinic" />
</svelte:head>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="hero-bg" style={heroImage ? `background-image:url('${heroImage}');` : ''}></div>
  <div class="container" style="position:relative;z-index:10;">
    <span class="section-label fade-up">About Us</span>
    <h1 class="fade-up-1">About &amp; Mission</h1>
    <p class="hero-sub fade-up-2">Gotham Data Clinic is a New York City-based 501(c)(3) nonprofit dedicated to building a more equitable future through computational and data science education.</p>
  </div>
</section>

<!-- VISION -->
<section class="sec-white">
  <div class="container two-col">
    <div>
      <span class="section-label">Our Vision</span>
      <h2>Building a fair and responsible future in science and technology</h2>
      <blockquote class="ember-border" style="margin-bottom:1.5rem;">
        <p class="body" style="font-style:italic;">"{visionQuote}"</p>
      </blockquote>
      <p class="body">{visionIntro}</p>
    </div>
    {#if missionVisualImage}
      <img src={missionVisualImage} alt="Data science visualization" class="sec-img" style="box-shadow:-8px 8px 0 #D9581F;" loading="lazy" />
    {/if}
  </div>
</section>

{#if missionFull}
  <!-- FULL MISSION STATEMENT -->
  <section class="sec-canvas">
    <div class="container" style="max-width:48rem;">
      <span class="section-label">Our Mission Statement</span>
      {#each missionFull.split('\n\n') as paragraph}
        <p class="body" style="margin-top:1rem;">{paragraph}</p>
      {/each}
    </div>
  </section>
{/if}

<!-- MISSION PILLARS -->
<section class="sec-canvas">
  <div class="container">
    <span class="section-label">Our Mission</span>
    <h2>Three pillars that guide everything we do</h2>
    <div class="three-col">
      {#each pillars as pillar, i}
        <div class="pillar">
          <ImpactIcon type={pillarIcons[i % pillarIcons.length]} />
          <h3>{pillar.title}</h3>
          <p class="sm-body">{pillar.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- HISTORY -->
<section class="sec-white">
  <div class="container two-col">
    <div>
      <span class="section-label">Our History</span>
      <h2>Born from a passion for science education in New York City</h2>
      <div class="timeline">
        {#each historyTimeline as step, i}
          <div class="tl-item">
            <div class="tl-dot {i === historyTimeline.length - 1 ? 'navy' : 'ember'}"></div>
            {#if i < historyTimeline.length - 1}<div class="tl-line"></div>{/if}
            <div class="tl-content">
              <span class="section-label">{step.label}</span>
              <p class="sm-body">{step.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div>
      <div class="brainwaves-box">
        <span class="section-label">Flagship Program</span>
        <h3 style="color:white;">BrainWaves</h3>
        {#if brainwavesImage}
          <img src={brainwavesImage} alt="EEG visualization" style="width:100%;height:10rem;object-fit:cover;margin-bottom:1rem;opacity:.8;" loading="lazy" />
        {/if}
        <p class="sm-body" style="color:rgba(255,255,255,.65);margin-bottom:1.5rem;">A hands-on neuroscience curriculum that provided experiential learning to thirty different high schools across New York City.</p>
        <a href="https://wp.nyu.edu/brainwaves" target="_blank" rel="noopener" class="tlink-light">Learn About BrainWaves →</a>
      </div>
      <div class="stats-mini">
        {#each stats as stat}
          <div class="sm-stat"><div class="sm-val">{stat.value}</div><div class="sm-lbl">{stat.label}</div></div>
        {/each}
      </div>
    </div>
  </div>
</section>


<!-- CTA -->
<section class="cta-ember">
  <div class="container cta-row">
    <div>
      <h3 style="color:#1D2B4A;">Meet the people behind Gotham Data Clinic</h3>
      <p style="color:rgba(29,43,74,.7);font-size:.875rem;margin-top:.25rem;">Our team of researchers, educators, and technologists</p>
    </div>
    <a href="/team" class="btn-navy">Meet Our Team →</a>
  </div>
</section>

<style>
.page-hero{position:relative;overflow:hidden;}
.hero-bg{position:absolute;inset:0;opacity:.15;background-size:cover;background-position:center;}
.hero-sub{font-size:1.125rem;line-height:1.7;color:rgba(255,255,255,.65);max-width:40rem;margin-top:1.5rem;}
.three-col{display:grid;gap:2rem;margin-top:3rem;}
@media(min-width:768px){.three-col{grid-template-columns:repeat(3,1fr);}}
h2{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#1D2B4A;line-height:1.25;margin-bottom:1.5rem;}
h3{font-size:1.125rem;font-weight:700;color:#1D2B4A;margin-bottom:.75rem;}
.body{font-size:1rem;line-height:1.7;color:#3D4A73;}
.sec-img{width:100%;height:22rem;object-fit:cover;}
.timeline{display:flex;flex-direction:column;gap:0;}
.tl-item{display:flex;gap:1rem;}
.tl-dot{width:2rem;height:2rem;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.tl-dot.ember{background:#D9581F;}
.tl-dot.navy{background:#1D2B4A;}
.tl-line{width:1px;flex:1;background:#DDE2EE;margin:.5rem 0;margin-left:-.5rem;}
.tl-content{padding-bottom:2rem;}
.brainwaves-box{background:#1D2B4A;padding:2rem;margin-bottom:1px;}
.tlink-light{font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D9581F;}
.stats-mini{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:#DDE2EE;}
.sm-stat{background:white;padding:1.5rem;text-align:center;}
.sm-val{font-size:1.5rem;font-weight:800;color:#1D2B4A;}
.sm-lbl{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#D9581F;margin-top:.25rem;}
.cta-ember{background:#D9581F;padding:4rem 0;}
</style>
