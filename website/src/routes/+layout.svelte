<script lang="ts">
  import '../app.css'
  import Navigation from '$lib/components/Navigation.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import { uploadUrl } from '$lib/cms'

  let { children, data } = $props()

  // Shared across every route — one org description, and the OG/Twitter
  // image is just the site logo (falls back to nothing shown if there's no
  // logo set, same as everywhere else the logo is used).
  let description = $derived(data.settings?.missionStatement || 'Gotham Data Clinic is a New York City-based nonprofit whose mission is to train the next generation of scientists and technologists in computing and data science — and to engage the public in these vital conversations.')
  let ogImage = $derived(uploadUrl(data.settings?.siteLogo))
</script>

<svelte:head>
  <title>Gotham Data Clinic</title>
  <meta name="description" content={description} />
  <meta property="og:site_name" content="Gotham Data Clinic" />
  <meta property="og:type" content="website" />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:description" content={description} />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:image" content={ogImage} />
    <meta property="og:image:alt" content="Gotham Data Clinic" />
  {/if}
</svelte:head>

<Navigation settings={data.settings} />
<main>
  {@render children()}
</main>
<Footer settings={data.settings} />
