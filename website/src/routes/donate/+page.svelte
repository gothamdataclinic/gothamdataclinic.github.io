<script lang="ts">
  import type { PageData } from './$types'
  import { uploadUrl } from '$lib/cms'
  let { data }: { data: PageData } = $props()

  let selectedAmount = $state(100)
  let customAmount = $state('')
  const amounts = [25, 50, 100, 250, 500, 1000]

  const fallbackImpactBlurbs = [
    { title: 'Fund Workshops', description: 'Your donation directly funds hands-on data science and computing workshops for NYC students who otherwise may not have access to this education.' },
    { title: 'Sustain Programs', description: 'Help us maintain and expand our BrainWaves platform and curriculum, keeping it freely available to high schools across New York City.' },
    { title: 'Advance Research', description: 'Support our scholarly publications and public engagement efforts that contribute to the national conversation on responsible computing education.' },
  ]

  let donationUrl = $derived(data.settings?.donationUrl || 'https://donorbox.org/give-to-gotham-data-clinic')
  let donationPlatform = $derived(data.settings?.donationPlatformName || 'Donorbox')
  let heroImage = $derived(uploadUrl(data.settings?.donateHeroImage))
  let ein = $derived(data.settings?.ein || '84-3894797')
  let finalAmount = $derived(customAmount ? parseInt(customAmount) : selectedAmount)
  let donationIntro = $derived(data.settings?.donationIntro || 'Gotham Data Clinic is entirely supported by the generosity of donors like you. Your gift helps us bring world-class data science education to students across New York City who need it most.')
  let impactBlurbs = $derived(data.settings?.impactBlurbs?.length ? data.settings.impactBlurbs : fallbackImpactBlurbs)
  let heroHeadline = $derived(data.settings?.donateHeroHeadline || 'Invest in the Next Generation of Scientists and Technologists')
</script>

<svelte:head><title>Donate | Gotham Data Clinic</title></svelte:head>

<section class="page-hero" style={heroImage ? `background-image: url('${heroImage}');` : ''}>
  <div class="hero-overlay"></div>
  <div class="container hero-inner">
    <span class="section-label fade-up">Support Our Work</span>
    <h1 class="fade-up-1">{heroHeadline}</h1>
    <p class="hero-sub fade-up-2">Gotham Data Clinic is a 501(c)(3) nonprofit. Your donation is fully tax-deductible and goes directly toward expanding access to computational education in New York City.</p>
    <p class="badge fade-up-3">&#10003; 100% tax-deductible &middot; EIN: {ein}</p>
  </div>
</section>

<section class="sec-canvas">
  <div class="container">
    <span class="section-label">Your Impact</span>
    <h2>Where your donation goes</h2>
    <div class="three-col">
      {#each impactBlurbs as blurb}
        <div class="impact-item"><div class="impact-icon"></div><h3>{blurb.title}</h3><p class="sm-body">{blurb.description}</p></div>
      {/each}
    </div>
  </div>
</section>

<section class="sec-white">
  <div class="container two-col">
    <div>
      <span class="section-label">Make a Donation</span>
      <h2>Every contribution makes a difference</h2>
      <p class="body" style="margin-bottom:2rem;">{donationIntro}</p>
      <div class="tax-note">
        <div class="section-label">Tax Deductibility</div>
        <p class="sm-body">Gotham Data Clinic is a 501(c)(3) charitable organization (EIN: {ein}). All donations are tax-deductible to the fullest extent permitted by law.</p>
        <a href="/tax-info" class="tlink" style="display:inline-block;margin-top:.75rem;">View Tax Information &#8594;</a>
      </div>
    </div>
    <div class="donate-form">
      <h3>Select a donation amount{donationPlatform ? ' via ' + donationPlatform : ''}</h3>
      <div class="amount-grid">
        {#each amounts as amt}
          <button class="amt-btn" class:selected={selectedAmount === amt && !customAmount} onclick={() => { selectedAmount = amt; customAmount = ''; }}>${amt}</button>
        {/each}
      </div>
      <div class="custom-wrap">
        <label class="section-label" style="margin-bottom:.5rem;">Or enter a custom amount</label>
        <div class="custom-input-wrap">
          <span class="dollar">$</span>
          <input type="number" min="1" placeholder="Enter amount" bind:value={customAmount} oninput={() => selectedAmount = 0} class="custom-input" />
        </div>
      </div>
      <a href={donationUrl} target="_blank" rel="noopener" class="btn-donate">Donate {finalAmount ? '$' + finalAmount : ''} Now &#8594;</a>
      <p class="fine-print">Secure donation processing &middot; Tax receipt provided &middot; EIN: {ein}</p>
    </div>
  </div>
</section>

<section class="cta-navy">
  <div class="container cta-row">
    <div><h3 style="color:white;">Need our tax information?</h3><p style="color:rgba(255,255,255,.55);font-size:.875rem;margin-top:.25rem;">View our EIN, 501(c)(3) status, and official tax documents</p></div>
    <a href="/tax-info" class="btn-ember">View Tax Information &#8594;</a>
  </div>
</section>

<style>
.page-hero{position:relative;padding:10rem 0 5rem;overflow:hidden;background-color:#1D2B4A;background-size:cover;background-position:center;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(19,27,46,.92) 0%,rgba(19,27,46,.7) 60%,rgba(19,27,46,.3) 100%);}
.hero-inner{position:relative;z-index:10;}
.hero-sub{font-size:1.125rem;line-height:1.7;color:rgba(255,255,255,.7);max-width:40rem;margin-top:1.5rem;}
.badge{font-size:.875rem;color:rgba(255,255,255,.65);margin-top:1.5rem;}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:white;line-height:1.15;}
h2{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#1D2B4A;line-height:1.25;margin-bottom:1.5rem;}
h3{font-size:1.125rem;font-weight:700;color:#1D2B4A;margin-bottom:.75rem;}
.body{font-size:1rem;line-height:1.7;color:#3D4A73;}
.sm-body{font-size:.875rem;line-height:1.6;color:#3D4A73;}
.sec-white{background:#fff;padding:5rem 0;}
.sec-canvas{background:#F3F5FA;padding:5rem 0;}
.two-col{display:grid;gap:3rem;}
@media(min-width:1024px){.two-col{grid-template-columns:1fr 1fr;gap:5rem;}}
.three-col{display:grid;gap:2rem;margin-top:3rem;}
@media(min-width:768px){.three-col{grid-template-columns:repeat(3,1fr);}}
.impact-icon{width:3rem;height:3rem;background:#1D2B4A;margin-bottom:1.25rem;}
.tax-note{padding:1.5rem;border-left:4px solid #D9581F;background:#F3F5FA;}
.donate-form{padding:2rem;border:1px solid #DDE2EE;background:#F3F5FA;}
.amount-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1rem;}
.amt-btn{padding:.75rem;font-size:.875rem;font-weight:700;border:2px solid #DDE2EE;background:white;color:#1D2B4A;cursor:pointer;transition:all .15s;}
.amt-btn.selected{background:#1D2B4A;color:white;border-color:#1D2B4A;}
.custom-wrap{margin-bottom:1.5rem;}
.custom-input-wrap{position:relative;}
.dollar{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);font-weight:700;color:#1D2B4A;}
.custom-input{width:100%;padding:.75rem .75rem .75rem 2rem;border:2px solid #DDE2EE;background:white;color:#1D2B4A;font-size:.875rem;outline:none;}
.custom-input:focus{border-color:#1D2B4A;}
.btn-donate{display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;padding:1rem;background:#D9581F;color:white;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:background .2s;text-decoration:none;}
.btn-donate:hover{background:#bf4a16;}
.fine-print{font-size:.75rem;text-align:center;color:#9a9a9a;margin-top:1rem;}
.cta-navy{background:#1D2B4A;padding:4rem 0;}
.cta-row{display:flex;flex-direction:column;gap:1.5rem;}
@media(min-width:640px){.cta-row{flex-direction:row;align-items:center;justify-content:space-between;}}
.btn-ember{display:inline-flex;align-items:center;gap:.5rem;padding:1rem 2rem;background:#D9581F;color:white;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:background .2s;text-decoration:none;}
.btn-ember:hover{background:#bf4a16;}
.tlink{font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1D2B4A;border-bottom:2px solid #D9581F;padding-bottom:2px;text-decoration:none;}
</style>
