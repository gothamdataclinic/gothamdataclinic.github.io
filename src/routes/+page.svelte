<script>
	import { siteTitle } from '$lib/config';
	import Intro from "$lib/content/intro.md"
	let { data } = $props();
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>

<!-- <h2>Gotham Data Clinic</h2> -->
<div align="center">
	<img src="images/gdc_logo.png" alt="Gotham Data Clinic logo" height="150px">
</div>

<Intro />

<!-- This is the README.md file in the root of the repo. It serves double duty as the homepage's content. If you'd rather use your own HTML and/or Svelte, you can delete/modify everything in this file. -->
<!-- <data.Intro /> -->
 <h2>Our Upcoming Event</h2>
<a href="https://redcap.ccny.cuny.edu/redcap/surveys/?s=T8LCLTXL3J">
	<img src="images/the_common_ground.png" alt="A flyer for the event, The Common Ground." width="600px" height="600px">
</a>
