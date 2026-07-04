<script lang="ts">
  import { uploadUrl } from '$lib/cms'

  let { settings = {} }: { settings?: Record<string, any> } = $props()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About & Mission' },
    { href: '/team', label: 'Our Team' },
    { href: '/events', label: 'Events' },
    { href: '/press', label: 'Press' },
    { href: '/donate', label: 'Donate' },
    { href: '/tax-info', label: 'Tax Information' },
  ]
  const year = new Date().getFullYear()
  let ein = $derived(settings.ein ?? '84-3894797')
  let logoUrl = $derived(uploadUrl(settings.siteLogo))
  let socialLinks = $derived(settings.socialLinks ?? {})
</script>

<footer style="background-color: #131B2E; color: white;">
  <div class="container" style="padding-top: 4rem; padding-bottom: 4rem;">
    <div class="footer-grid">

      <!-- Brand -->
      <div class="brand-col">
        <div class="logo-row">
          {#if logoUrl}
            <img src={logoUrl} alt="GDC" style="height: 36px; filter: brightness(0) invert(1);" />
          {/if}
          <span style="font-weight: 700; font-size: 0.875rem; color: white;">Gotham Data Clinic</span>
        </div>
        <p style="font-size: 0.875rem; line-height: 1.6; max-width: 28rem; color: #7A8BAA;">
          A New York City-based 501(c)(3) nonprofit training the next generation of scientists and technologists in computing and data science.
        </p>
        <div class="contact-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D9581F" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:{settings.contactEmail ?? 'info@gothamdataclinic.org'}" class="footer-link">
            {settings.contactEmail ?? 'info@gothamdataclinic.org'}
          </a>
        </div>
      </div>

      <!-- Navigation -->
      <div>
        <h4 class="footer-heading">Navigation</h4>
        <ul class="footer-list">
          {#each navLinks as link}
            <li><a href={link.href} class="footer-link">{link.label}</a></li>
          {/each}
        </ul>
      </div>

      <!-- Organization -->
      <div>
        <h4 class="footer-heading">Organization</h4>
        <ul class="footer-list">
          <li><a href="/tax-info" class="footer-link">EIN: {ein}</a></li>
          <li><a href="/donate" class="footer-link footer-donate">Donate Now →</a></li>
          {#if socialLinks.bluesky}
            <li><a href={socialLinks.bluesky} target="_blank" rel="noopener" class="footer-link">Bluesky ↗</a></li>
          {/if}
          {#if socialLinks.linkedin}
            <li><a href={socialLinks.linkedin} target="_blank" rel="noopener" class="footer-link">LinkedIn ↗</a></li>
          {/if}
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <p style="font-size: 0.75rem; color: #4A5A72;">
        &copy;{year} Gotham Data Clinic, a 501(c)(3) organization (EIN: {ein}). All rights reserved.
      </p>
    </div>
  </div>
</footer>

<style>
  .footer-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 3rem; }
  @media (min-width: 768px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr; } }
  .brand-col {}
  .logo-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .contact-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; }
  .footer-heading { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #D9581F; margin-bottom: 1rem; }
  .footer-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .footer-link { font-size: 0.875rem; color: #7A8BAA; transition: color 0.2s; text-decoration: none; }
  .footer-link:hover { color: white; }
  .footer-donate { color: #D9581F !important; font-weight: 600; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 2rem; }
</style>
