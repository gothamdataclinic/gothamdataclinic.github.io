<script lang="ts">
  import '../app.css'
  import Navigation from '$lib/components/Navigation.svelte'
  import Footer from '$lib/components/Footer.svelte'

  let { children, data } = $props()
</script>

<svelte:head>
  <title>Gotham Data Clinic</title>
  <meta name="description" content="Gotham Data Clinic is a New York City-based nonprofit training the next generation of scientists and technologists in computing and data science." />
</svelte:head>

<Navigation settings={data.settings} />
<main>
  {@render children()}
</main>
<Footer settings={data.settings} />
