<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { uploadUrl } from '$lib/cms'

  let { settings = {} }: { settings?: Record<string, any> } = $props()

  let scrolled = $state(false)
  let menuOpen = $state(false)
  let logoUrl = $derived(uploadUrl(settings.siteLogo))

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About & Mission' },
    { href: '/team', label: 'Team' },
    { href: '/events', label: 'Events' },
    { href: '/press', label: 'Press' },
    { href: '/donate', label: 'Donate' },
    { href: '/tax-info', label: 'Tax Information' },
  ]

  onMount(() => {
    const onScroll = () => { scrolled = window.scrollY > 60 }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  })

  let isHome = $derived($page.url.pathname === '/')
  let transparent = $derived(isHome && !scrolled)
  let currentPath = $derived($page.url.pathname)
</script>

<header
  class="gdc-header"
  style="
    background-color: {transparent ? 'rgba(13,20,38,0.45)' : 'rgba(255,255,255,0.97)'};
    backdrop-filter: blur({transparent ? '4' : '12'}px);
    box-shadow: {transparent ? 'none' : '0 1px 0 #DDE2EE'};
  "
>
  <div class="container nav-inner">
    <!-- Logo -->
    <a href="/" class="logo-wrap">
      {#if logoUrl}
        <img
          src={logoUrl}
          alt="GDC"
          class="logo-img"
          style="filter: {transparent ? 'brightness(0) invert(1)' : 'none'};"
        />
      {/if}
      <span class="logo-text" style="color: {transparent ? 'white' : '#1D2B4A'};">Gotham Data Clinic</span>
    </a>

    <!-- Desktop Nav -->
    <nav class="desktop-nav">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={currentPath === link.href}
          style="color: {transparent ? 'rgba(255,255,255,0.9)' : '#1D2B4A'};"
        >{link.label}</a>
      {/each}
      <a
        href="/donate"
        class="btn-donate"
        onmouseenter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#bf4a16'}
        onmouseleave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#D9581F'}
      >Donate</a>
    </nav>

    <!-- Mobile toggle -->
    <button
      class="mobile-toggle"
      style="color: {transparent ? 'white' : '#1D2B4A'};"
      onclick={() => menuOpen = !menuOpen}
      aria-label="Toggle menu"
    >
      {#if menuOpen}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      {:else}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      {/if}
    </button>
  </div>
</header>

<!-- Mobile Drawer -->
{#if menuOpen}
  <div class="drawer-overlay">
    <div class="drawer-bg" onclick={() => menuOpen = false} role="presentation"></div>
    <nav class="drawer">
      <div class="drawer-logo">
        {#if logoUrl}
          <img src={logoUrl} alt="GDC" style="height:32px;filter:brightness(0) invert(1);" />
        {/if}
        <span style="font-weight:700;font-size:1.25rem;color:white;">Gotham Data Clinic</span>
      </div>
      {#each navLinks as link}
        <a
          href={link.href}
          class="drawer-link"
          style="color: {currentPath === link.href ? '#D9581F' : 'rgba(255,255,255,0.85)'};"
          onclick={() => menuOpen = false}
        >{link.label}</a>
      {/each}
      <a href="/donate" class="drawer-donate" onclick={() => menuOpen = false}>Donate Now</a>
    </nav>
  </div>
{/if}

<style>
  .gdc-header { position:fixed; top:0; left:0; right:0; z-index:50; transition:all .3s; }
  .nav-inner { display:flex; align-items:center; justify-content:space-between; height:72px; }
  .logo-wrap { display:flex; align-items:center; gap:.75rem; text-decoration:none; }
  .logo-img { height:36px; width:auto; transition:filter .3s; }
  .logo-text { font-weight:700; font-size:1.25rem; letter-spacing:.02em; transition:color .3s; white-space:nowrap; }
  .desktop-nav { display:none; align-items:center; gap:1.5rem; }
  @media(min-width:1024px) { .desktop-nav { display:flex; } }
  .nav-link { font-weight:500; font-size:.9375rem; position:relative; padding-bottom:2px; transition:color .3s; }
  .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#D9581F; transition:width .2s cubic-bezier(.23,1,.32,1); }
  .nav-link:hover::after, .nav-link.active::after { width:100%; }
  .btn-donate { padding:.5rem 1.25rem; background:#D9581F; color:white; font-size:.8125rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; transition:background .2s; }
  .mobile-toggle { display:flex; padding:.5rem; background:none; border:none; cursor:pointer; }
  @media(min-width:1024px) { .mobile-toggle { display:none; } }
  .drawer-overlay { position:fixed; inset:0; z-index:40; }
  .drawer-bg { position:absolute; inset:0; background:rgba(0,0,0,.5); }
  .drawer { position:absolute; top:0; right:0; bottom:0; width:18rem; background:#1D2B4A; display:flex; flex-direction:column; padding:5rem 1.5rem 2rem; }
  .drawer-logo { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(255,255,255,.1); }
  .drawer-link { display:block; padding:1rem 0; font-size:1rem; font-weight:500; border-bottom:1px solid rgba(255,255,255,.1); transition:color .2s; }
  .drawer-donate { margin-top:1.5rem; padding:.75rem; background:#D9581F; color:white; font-size:.875rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; text-align:center; }
</style>
