<script lang="ts">
  import type { PageData } from './$types'
  import { uploadUrl, type Upload } from '$lib/cms'

  let { data }: { data: PageData } = $props()
  let settings = $derived(data.settings ?? {})

  let openFaq = $state(-1)
  const toggle = (i: number) => openFaq = openFaq === i ? -1 : i

  let ein = $derived(settings.ein || '84-3894797')
  let taxExemptStatus = $derived(settings.taxExemptStatus || '501(c)(3) Public Charity')
  let fiscalYear = $derived(settings.fiscalYear || 'January 1 – December 31')
  let stateOfIncorporation = $derived(settings.stateOfIncorporation || 'New York')
  let taxDocuments = $derived(settings.taxDocuments ?? [])

  let details = $derived([
    { label: 'Organization Name', value: 'Gotham Data Clinic', hi: false },
    { label: 'Employer Identification Number (EIN)', value: ein, hi: true },
    { label: 'Tax-Exempt Status', value: taxExemptStatus, hi: true },
    { label: 'IRS Determination', value: 'Recognized by the Internal Revenue Service', hi: false },
    { label: 'Fiscal Year', value: fiscalYear, hi: false },
    { label: 'State of Incorporation', value: stateOfIncorporation, hi: false },
    { label: 'Headquarters', value: 'New York City, New York', hi: false },
    { label: 'Deductibility', value: 'Contributions are tax-deductible to the fullest extent permitted by law', hi: true },
  ])

  const fallbackFaqs = [
    { question: 'Is my donation to Gotham Data Clinic tax-deductible?', answer: 'Yes. Gotham Data Clinic is recognized by the IRS as a 501(c)(3) public charity. Donations are tax-deductible to the fullest extent permitted by law. You should consult your tax advisor regarding the deductibility of your specific contribution.' },
    { question: "What is Gotham Data Clinic's EIN?", answer: 'Our Employer Identification Number (EIN) is 84-3894797. You will need this number when claiming your charitable deduction on your federal tax return.' },
    { question: 'Will I receive a receipt for my donation?', answer: 'Yes. All donors receive a written acknowledgment of their contribution, which serves as your official receipt for tax purposes. Please retain this document for your records.' },
    { question: "Where can I find Gotham Data Clinic's Form 990?", answer: 'As a 501(c)(3) organization, Gotham Data Clinic files Form 990 with the IRS annually. Our filings are publicly available through the IRS website and nonprofit transparency databases such as ProPublica Nonprofit Explorer and GuideStar/Candid.' },
    { question: 'Are in-kind donations accepted?', answer: 'We welcome in-kind donations of equipment, software, and professional services. Please contact us at info@gothamdataclinic.org to discuss in-kind contributions.' },
    { question: 'Can my employer match my donation?', answer: "Many employers offer matching gift programs for donations to 501(c)(3) organizations. Please check with your employer's HR department to see if Gotham Data Clinic qualifies." },
  ]
  let faqs = $derived(settings.faqItems?.length ? settings.faqItems : fallbackFaqs)

  function documentUrl(doc: { file?: Upload; externalUrl?: string }) {
    return uploadUrl(doc.file) || doc.externalUrl || null
  }
</script>

<svelte:head>
  <title>Tax Information | Gotham Data Clinic</title>
  <meta property="og:title" content="Tax Information | Gotham Data Clinic" />
  <meta property="og:url" content="https://gothamdataclinic.org/tax-info" />
  <meta name="twitter:title" content="Tax Information | Gotham Data Clinic" />
</svelte:head>

<section class="page-hero">
  <div class="container">
    <span class="section-label fade-up">Legal &amp; Compliance</span>
    <h1 class="fade-up-1">Tax Information</h1>
    <p class="hero-sub fade-up-2">Gotham Data Clinic is a recognized 501(c)(3) public charity. All donations are fully tax-deductible. Find our official tax details and donor guidance below.</p>
    <div class="badges fade-up-3">
      <span class="badge">✓ IRS 501(c)(3) Recognized</span>
      <span class="badge">✓ Tax-Deductible Donations</span>
    </div>
  </div>
</section>

<section class="sec-white">
  <div class="container two-col">
    <div>
      <span class="section-label">Official Details</span>
      <h2>Organization Tax Details</h2>
      <div class="details-table">
        {#each details as d}
          <div class="detail-row">
            <span class="detail-label">{d.label}</span>
            <span class="detail-value" class:highlight={d.hi}>
              {#if d.hi}<span class="dot"></span>{/if}{d.value}
            </span>
          </div>
        {/each}
      </div>
    </div>
    <div>
      <div class="ein-box">
        <span class="section-label">Employer Identification Number</span>
        <div class="ein-num">{ein}</div>
        <p class="sm-body" style="color:rgba(255,255,255,.6);">Use this number when claiming your charitable deduction on your federal tax return (Form 1040, Schedule A).</p>
      </div>
      {#if taxDocuments.length}
        <div class="resources">
          <h3>Official Documents</h3>
          <ul>
            {#each taxDocuments as doc}
              {#if documentUrl(doc)}
                <li><a href={documentUrl(doc)} target="_blank" rel="noopener" class="res-link">{doc.label}{doc.year ? ` (${doc.year})` : ''} ↗</a></li>
              {/if}
            {/each}
          </ul>
        </div>
      {/if}
      <div class="resources">
        <h3>External Resources</h3>
        <ul>
          <li><a href="https://apps.irs.gov/app/eos/" target="_blank" rel="noopener" class="res-link">IRS Tax Exempt Organization Search ↗</a></li>
          <li><a href="https://projects.propublica.org/nonprofits/organizations/843894797" target="_blank" rel="noopener" class="res-link">ProPublica Nonprofit Explorer ↗</a></li>
          <li><a href="https://app.candid.org/profile/16556010/cielabs-inc-84-3894797" target="_blank" rel="noopener" class="res-link">Candid / GuideStar ↗</a></li>
        </ul>
      </div>
      <div class="contact-box">
        <h4>Request Official Documentation</h4>
        <p class="sm-body">For official tax determination letters, Form 990 filings, or other documentation, please contact us at <a href="mailto:info@gothamdataclinic.org" style="font-weight:700;color:#1D2B4A;">info@gothamdataclinic.org</a></p>
      </div>
    </div>
  </div>
</section>

<section class="sec-canvas">
  <div class="container">
    <span class="section-label">Frequently Asked Questions</span>
    <h2>Donor Tax FAQs</h2>
    <div class="faq-list">
      {#each faqs as faq, i}
        <div class="faq-item">
          <button class="faq-q" onclick={() => toggle(i)}>
            <span>{faq.question}</span>
            <span class="faq-icon" style="transform:{openFaq === i ? 'rotate(45deg)' : 'none'};">+</span>
          </button>
          {#if openFaq === i}
            <div class="faq-a"><p class="sm-body">{faq.answer}</p></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="cta-ember">
  <div class="container cta-row">
    <div>
      <h3 style="color:#1D2B4A;">Ready to make a tax-deductible donation?</h3>
      <p style="color:rgba(29,43,74,.7);font-size:.875rem;margin-top:.25rem;">Support computational education in New York City</p>
    </div>
    <a href="/donate" class="btn-navy">Donate Now →</a>
  </div>
</section>

<style>
.hero-sub{font-size:1.125rem;line-height:1.7;color:rgba(255,255,255,.65);max-width:40rem;margin-top:1.5rem;}
h2{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#1D2B4A;line-height:1.25;margin-bottom:2rem;}
h3{font-size:1.125rem;font-weight:700;color:#1D2B4A;margin-bottom:1rem;}
h4{font-size:.9375rem;font-weight:700;color:#1D2B4A;margin-bottom:.5rem;}
.badges{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem;}
.badge{font-size:.875rem;font-weight:700;color:#D9581F;padding:.5rem 1rem;border:1px solid rgba(217,88,31,.35);background:rgba(217,88,31,.1);}
.details-table{border-top:1px solid #DDE2EE;}
.detail-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem 0;border-bottom:1px solid #DDE2EE;}
.detail-label{font-size:.875rem;color:#3D4A73;}
.detail-value{font-size:.875rem;font-weight:600;color:#3D4A73;display:flex;align-items:center;gap:.5rem;}
.detail-value.highlight{color:#1D2B4A;}
.dot{width:.5rem;height:.5rem;border-radius:50%;background:#D9581F;flex-shrink:0;}
.ein-box{background:#1D2B4A;padding:2rem;margin-bottom:1rem;}
.ein-num{font-size:2.25rem;font-weight:800;color:white;letter-spacing:.05em;margin:.5rem 0 1rem;}
.resources{padding:1.5rem;border:1px solid #DDE2EE;margin-bottom:1rem;}
.resources ul{list-style:none;display:flex;flex-direction:column;gap:.75rem;margin-top:.75rem;}
.res-link{font-size:.875rem;font-weight:500;color:#1D2B4A;transition:color .2s;}
.res-link:hover{color:#D9581F;}
.contact-box{padding:1.5rem;background:#F3F5FA;}
.faq-list{max-width:48rem;}
.faq-item{border-bottom:1px solid #DDE2EE;}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.25rem 0;background:none;border:none;cursor:pointer;text-align:left;font-size:1rem;font-weight:600;color:#1D2B4A;}
.faq-icon{font-size:1.25rem;color:#D9581F;transition:transform .2s;flex-shrink:0;}
.faq-a{padding-bottom:1.25rem;}
.cta-ember{background:#D9581F;padding:4rem 0;}
</style>
