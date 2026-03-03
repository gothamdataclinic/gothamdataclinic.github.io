<script>
	import Md from "$lib/content/about/about.md"
	let { data } = $props();
	let { team } = data;
</script>
<svelte:head>
	<title>Our Team</title>	
</svelte:head>

{#snippet memberContent(member)}
	<h3>{member.metadata.name}</h3>
	<img src={`images/headshots/${member.metadata.givenName.toLowerCase()}.jpg`} alt={`photo of ${member.metadata.givenName}`} width="200px">
	<p>{member.metadata.description}</p>
{/snippet}

<h2>Team</h2>
	{#each team as member }
		{#if member.metadata.founder == false}
			{@render memberContent(member)}
		{/if}
	{/each}
<h2>Founding Members</h2>
	{#each team as member }
		{#if member.metadata.founder}
			{@render memberContent(member)}
		{/if}
	<!-- <h3>{member.title}</h3> -->
{/each}