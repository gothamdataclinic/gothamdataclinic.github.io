<script lang="ts">
  import type { PageData } from './$types'
  import { uploadUrl } from '$lib/cms'
  let { data }: { data: PageData } = $props()

  let heroImage = $derived(uploadUrl(data.settings?.teamHeroImage))

  const avatarColors = [
    { bg: '#1D2B4A', text: '#D9581F' },
    { bg: '#3D4A73', text: '#FFFFFF' },
    { bg: '#D9581F', text: '#FFFFFF' },
    { bg: '#131B2E', text: '#D9581F' },
    { bg: '#1D2B4A', text: '#FFFFFF' },
  ]

  function initials(name: string) {
    return name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0,2).map(w => w[0]).join('')
  }

  function colorFor(name: string) {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  let selectedMember: any = $state(null)

  function openMember(member: any) {
    selectedMember = member
  }

  function closeMember() {
    selectedMember = null
  }

  $effect(() => {
    document.body.style.overflow = selectedMember ? 'hidden' : ''
  })

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeMember()
  }

  let current = $derived((data.team ?? []).filter((m: any) => m.memberType === 'current'))
  let founding = $derived((data.team ?? []).filter((m: any) => m.memberType === 'founding'))

  // Fallback static data if Sanity not yet connected
  const staticCurrent = [
    { _id:'1', name:'Eric Chen, Ph.D', role:'Team Member', bio:'Eric is a Brooklyn native who joined GDC while performing computational chemistry research at NYU. He recently led the development of the Chemistry department’s first STEM outreach program with local high schools.', tags:['Computational Chemistry','STEM Outreach','NYU'] },
    { _id:'2', name:'Nicolas Bustamente', role:'Team Member', bio:'Nicholas is from Queens, New York, and graduated as a Computer Engineer from Binghamton University in 2024. He is now an ETL Developer for MUFG Securities, joining the Gotham Data Clinic team in 2025.', tags:['Computer Engineering','ETL Development','Data Engineering'] },
  ]
  const staticFounding = [
    { _id:'3', name:'Teon Brooks, Ph.D', role:'Co-Founder & President', bio:'Teon is the co-founder and President of Gotham Data Clinic. A trained cognitive scientist with extensive experience in data science and research software engineering, he has over a decade of open-source software contribution, primarily in brain imaging research.', tags:['Cognitive Science','Data Science','Brain Imaging','Open Source'] },
    { _id:'4', name:'Mya Doelling, MBA', role:'Founding Member', bio:'Mya joined GDC while serving as a Manager of Global Partnerships at the International Olympic Committee. Prior to her current role, Mya began her career as Director of Operations for the Michael Phelps Foundation.', tags:['Global Partnerships','Operations','Nonprofit Leadership'] },
    { _id:'5', name:'Steven Azeka, Ed.D', role:'Founding Member', bio:'Steve joined Gotham Data Clinic while serving as a Program Lead for Responsible Computing at Mozilla and an Adjunct at the College of Staten Island. He taught STEM at the elementary and high school levels in California and New York.', tags:['Responsible Computing','Mozilla','Education','BrainWaves'] },
  ]

  let displayCurrent = $derived(current.length ? current : staticCurrent)
  let displayFounding = $derived(founding.length ? founding : staticFounding)
</script>

<svelte:head>
  <title>Our Team | Gotham Data Clinic</title>
  <meta property="og:title" content="Our Team | Gotham Data Clinic" />
  <meta property="og:url" content="https://gothamdataclinic.org/team" />
  <meta name="twitter:title" content="Our Team | Gotham Data Clinic" />
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<section class="page-hero">
  <div class="hero-bg" style={heroImage ? `background-image:url('${heroImage}');` : ''}></div>
  <div class="container" style="position:relative;z-index:10;">
    <span class="section-label fade-up">Our People</span>
    <h1 class="fade-up-1">The Team Behind Gotham Data Clinic</h1>
    <p class="hero-sub fade-up-2">A dedicated group of researchers, educators, and technologists committed to expanding access to computational education in New York City.</p>
  </div>
</section>

<section class="sec-white">
  <div class="container">
    <span class="section-label">Current Team</span>
    <h2>Team Members</h2>
    <div class="team-grid">
      {#each displayCurrent as member, i}
        <button type="button" class="member-card card-hover" onclick={() => openMember(member)}>
          {#if uploadUrl(member.photo, 'thumbnail')}
            <img class="avatar" src={uploadUrl(member.photo, 'thumbnail')} alt={member.name} loading="lazy" />
          {:else}
            <div class="avatar" style="background:{avatarColors[i % avatarColors.length].bg}; color:{avatarColors[i % avatarColors.length].text};">
              {initials(member.name)}
            </div>
          {/if}
          <div class="member-body">
            <span class="section-label">{member.role}</span>
            <h3>{member.name}</h3>
            <p class="sm-body">{member.bio}</p>
            <div class="tags">
              {#each (member.tags ?? []) as tag}
                <span class="tag">{typeof tag === 'string' ? tag : tag.tag}</span>
              {/each}
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<section class="sec-canvas">
  <div class="container">
    <span class="section-label">Founding Members</span>
    <h2>The Founders</h2>
    <div class="team-grid">
      {#each displayFounding as member, i}
        <button type="button" class="member-card card-hover" onclick={() => openMember(member)}>
          {#if uploadUrl(member.photo, 'thumbnail')}
            <img class="avatar" src={uploadUrl(member.photo, 'thumbnail')} alt={member.name} loading="lazy" />
          {:else}
            <div class="avatar" style="background:{avatarColors[(i+2) % avatarColors.length].bg}; color:{avatarColors[(i+2) % avatarColors.length].text};">
              {initials(member.name)}
            </div>
          {/if}
          <div class="member-body">
            <span class="section-label">{member.role}</span>
            <h3>{member.name}</h3>
            <p class="sm-body">{member.bio}</p>
            <div class="tags">
              {#each (member.tags ?? []) as tag}
                <span class="tag">{typeof tag === 'string' ? tag : tag.tag}</span>
              {/each}
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<section class="cta-ember">
  <div class="container cta-row">
    <div>
      <h3 style="color:#1D2B4A;">Support the work of our team</h3>
      <p style="color:rgba(29,43,74,.7);font-size:.875rem;margin-top:.25rem;">Your donation funds our programs and the people who make them possible</p>
    </div>
    <a href="/donate" class="btn-navy">Donate Now →</a>
  </div>
</section>

{#if selectedMember}
  <div class="modal-overlay">
    <button type="button" class="modal-backdrop" onclick={closeMember} aria-label="Close"></button>
    <div class="modal">
      <button type="button" class="modal-close" onclick={closeMember} aria-label="Close">&times;</button>
      <div class="modal-photo-panel">
        {#if uploadUrl(selectedMember.photo, 'card')}
          <img class="modal-photo" src={uploadUrl(selectedMember.photo, 'card')} alt={selectedMember.name} loading="lazy" />
        {:else}
          <div class="modal-photo modal-photo-fallback" style="background:{colorFor(selectedMember.name).bg}; color:{colorFor(selectedMember.name).text};">
            {initials(selectedMember.name)}
          </div>
        {/if}
      </div>
      <div class="modal-content">
        <span class="section-label">{selectedMember.role}</span>
        <h3>{selectedMember.name}</h3>
        <p class="sm-body">{selectedMember.bio}</p>
        <div class="tags">
          {#each (selectedMember.tags ?? []) as tag}
            <span class="tag">{typeof tag === 'string' ? tag : tag.tag}</span>
          {/each}
        </div>
        {#if selectedMember.linkedinUrl || selectedMember.personalSiteUrl}
          <div class="modal-links">
            {#if selectedMember.linkedinUrl}
              <a href={selectedMember.linkedinUrl} target="_blank" rel="noopener" class="tlink">LinkedIn →</a>
            {/if}
            {#if selectedMember.personalSiteUrl}
              <a href={selectedMember.personalSiteUrl} target="_blank" rel="noopener" class="tlink">Personal Site →</a>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
.page-hero{position:relative;padding:10rem 0 5rem;overflow:hidden;background:#1D2B4A;}
.hero-bg{position:absolute;inset:0;opacity:.15;background-size:cover;background-position:center;}
.hero-sub{font-size:1.125rem;line-height:1.7;color:rgba(255,255,255,.65);max-width:40rem;margin-top:1.5rem;}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:white;line-height:1.15;}
h2{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#1D2B4A;line-height:1.25;margin-bottom:2rem;}
h3{font-size:1.125rem;font-weight:700;color:#1D2B4A;margin-bottom:.75rem;}
.sm-body{font-size:.875rem;line-height:1.6;color:#3D4A73;}
.sec-white{background:#fff;padding:5rem 0;}
.sec-canvas{background:#F3F5FA;padding:5rem 0;}
.team-grid{display:grid;gap:2rem;}
@media(min-width:640px){.team-grid{grid-template-columns:repeat(2,1fr);}}
@media(min-width:1024px){.team-grid{grid-template-columns:repeat(3,1fr);}}
.member-card{position:relative;background:#1D2B4A;overflow:hidden;min-height:18rem;display:block;width:100%;border:none;padding:0;margin:0;font:inherit;text-align:left;cursor:pointer;color:inherit;}
.avatar{position:absolute;inset:0 0 0 auto;width:55%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:800;letter-spacing:-.02em;object-fit:cover;}
img.avatar{opacity:.55;}
.member-card::before{content:'';position:absolute;inset:0;background:linear-gradient(to right, #1D2B4A 35%, rgba(29,43,74,.65) 55%, rgba(29,43,74,0) 100%);z-index:1;}
.member-body{position:relative;z-index:2;max-width:72%;padding:1.5rem;}
.member-card h3{color:white;}
.member-card .sm-body{color:rgba(255,255,255,.75);}
.tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;}
.tag{font-size:.75rem;padding:.25rem .5rem;background:rgba(255,255,255,.12);color:white;}
.cta-ember{background:#D9581F;padding:4rem 0;}
.cta-row{display:flex;flex-direction:column;gap:1.5rem;}
@media(min-width:640px){.cta-row{flex-direction:row;align-items:center;justify-content:space-between;}}
.btn-navy{display:inline-flex;align-items:center;gap:.5rem;padding:1rem 2rem;background:#1D2B4A;color:white;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:background .2s;}
.btn-navy:hover{background:#131B2E;}

.modal-overlay{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:1.5rem;}
.modal-backdrop{position:absolute;inset:0;width:100%;height:100%;background:rgba(19,27,46,.72);border:none;padding:0;margin:0;cursor:pointer;z-index:0;}
.modal{background:#1D2B4A;max-width:44rem;width:100%;max-height:88vh;overflow-y:auto;position:relative;z-index:1;}
@media(min-width:640px){.modal{display:grid;grid-template-columns:60% 40%;max-height:80vh;}}
.modal-content{order:1;}
.modal-photo-panel{order:2;}
.modal-close{position:absolute;top:1rem;right:1rem;z-index:5;width:2.25rem;height:2.25rem;border-radius:50%;background:rgba(255,255,255,.12);color:white;border:none;font-size:1.125rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.modal-close:hover{background:rgba(255,255,255,.22);}
.modal-photo-panel{position:relative;min-height:14rem;}
.modal-photo{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:800;letter-spacing:-.02em;}
.modal-photo-panel::after{content:'';position:absolute;inset:0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);background:linear-gradient(to left, rgba(29,43,74,0) 55%, rgba(29,43,74,.5) 78%, #1D2B4A 100%);-webkit-mask-image:linear-gradient(to left, transparent 55%, black 100%);mask-image:linear-gradient(to left, transparent 55%, black 100%);}
.modal-content{padding:2rem;position:relative;z-index:2;}
.modal-content h3{color:white;font-size:1.5rem;margin:.5rem 0 .25rem;}
.modal-content .sm-body{color:rgba(255,255,255,.8);font-size:.9375rem;line-height:1.7;}
.modal-links{display:flex;flex-wrap:wrap;gap:1.25rem;margin-top:1.25rem;}
.tlink{font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D9581F;}
</style>
