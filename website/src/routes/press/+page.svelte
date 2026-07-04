<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  let pubs = $derived(data.publications ?? [])

  let years = $derived([...new Set(pubs.map((p: any) => p.year))].sort((a: any, b: any) => b - a))
</script>

<svelte:head>
  <title>Press | Gotham Data Clinic</title>
  <meta property="og:title" content="Press | Gotham Data Clinic" />
  <meta property="og:url" content="https://gothamdataclinic.org/press" />
  <meta name="twitter:title" content="Press | Gotham Data Clinic" />
</svelte:head>

<section class="page-hero">
  <div class="container">
    <span class="section-label fade-up">Research &amp; Media</span>
    <h1 class="fade-up-1">Press</h1>
    <p class="hero-sub fade-up-2">Peer-reviewed papers, conference proceedings, reports, and press coverage featuring the Gotham Data Clinic team.</p>
  </div>
</section>

<section class="sec-canvas">
  <div class="container">
    {#if pubs.length === 0}
      <div class="empty">
        <p>No publications yet. Check back soon.</p>
      </div>
    {:else}
      {#each years as year}
        <div class="year-group">
          <h2 class="year-heading">{year}</h2>
          <div class="pub-list">
            {#each pubs.filter((p: any) => p.year === year) as pub}
              <div class="pub-card card-hover">
                <div class="pub-meta">
                  {#if pub.publicationType}<span class="pub-type">{pub.publicationType}</span>{/if}
                  {#if pub.journal}<span class="pub-journal">{pub.journal}</span>{/if}
                </div>
                <h3>{pub.title}</h3>
                {#if pub.authors?.length}
                  <p class="authors">{pub.authors.join(', ')}</p>
                {/if}
                {#if pub.abstract}
                  <p class="sm-body abstract">{pub.abstract}</p>
                {/if}
                <div class="pub-links">
                  {#if pub.doi}
                    <a href={pub.doi} target="_blank" rel="noopener" class="pub-link">View Paper ↗</a>
                  {/if}
                  {#if pub.pdfUrl}
                    <a href={pub.pdfUrl} target="_blank" rel="noopener" class="pub-link">Download PDF ↗</a>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</section>

<section class="cta-navy">
  <div class="container cta-row">
    <div>
      <h3 style="color:white;">Collaborate with us</h3>
      <p style="color:rgba(255,255,255,.55);font-size:.875rem;margin-top:.25rem;">Interested in research partnerships or citing our work?</p>
    </div>
    <a href="mailto:info@gothamdataclinic.org" class="btn-ember">Get In Touch →</a>
  </div>
</section>

<style>
.page-hero{background:#1D2B4A;padding:10rem 0 5rem;}
.hero-sub{font-size:1.125rem;line-height:1.7;color:rgba(255,255,255,.65);max-width:40rem;margin-top:1.5rem;}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:white;line-height:1.15;}
h3{font-size:1.125rem;font-weight:700;color:#1D2B4A;margin-bottom:.5rem;}
.sm-body{font-size:.875rem;line-height:1.6;color:#3D4A73;}
.sec-canvas{background:#F3F5FA;padding:5rem 0;}
.year-group{margin-bottom:3rem;}
.year-heading{font-size:1.5rem;font-weight:800;color:#1D2B4A;border-bottom:2px solid #D9581F;padding-bottom:.5rem;margin-bottom:1.5rem;display:inline-block;}
.pub-list{display:flex;flex-direction:column;gap:1.5rem;}
.pub-card{background:white;border:1px solid #DDE2EE;padding:2rem;}
.pub-meta{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:.75rem;align-items:center;}
.pub-type{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:white;background:#1D2B4A;padding:.25rem .5rem;}
.pub-journal{font-size:.8125rem;font-weight:600;color:#3D4A73;font-style:italic;}
.authors{font-size:.875rem;color:#3D4A73;margin-bottom:.75rem;}
.abstract{margin-top:.75rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.pub-links{display:flex;gap:1.5rem;margin-top:1rem;}
.pub-link{font-size:.8125rem;font-weight:700;color:#D9581F;letter-spacing:.04em;transition:opacity .2s;}
.pub-link:hover{opacity:.7;}
.empty{text-align:center;padding:4rem;color:#3D4A73;font-size:1rem;}
.cta-navy{background:#1D2B4A;padding:4rem 0;}
.cta-row{display:flex;flex-direction:column;gap:1.5rem;}
@media(min-width:640px){.cta-row{flex-direction:row;align-items:center;justify-content:space-between;}}
.btn-ember{display:inline-flex;align-items:center;gap:.5rem;padding:1rem 2rem;background:#D9581F;color:white;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:background .2s;}
.btn-ember:hover{background:#bf4a16;}
</style>
