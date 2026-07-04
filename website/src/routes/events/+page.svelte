<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  let events = $derived(data.events ?? [])
  let upcomingEvents = $derived(events.filter((e: any) => new Date(e.date).getTime() >= Date.now()))
  let pastEvents = $derived(events.filter((e: any) => new Date(e.date).getTime() < Date.now()))

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  }
  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' })
  }
</script>

<svelte:head><title>Events | Gotham Data Clinic</title></svelte:head>

<section class="page-hero">
  <div class="container">
    <span class="section-label fade-up">Events &amp; Lectures</span>
    <h1 class="fade-up-1">Events</h1>
    <p class="hero-sub fade-up-2">Workshops, lectures, and community events bringing data science education to New York City.</p>
  </div>
</section>

<section class="sec-canvas">
  <div class="container">
    {#snippet eventRow(event: any)}
      <div class="event-row card-hover">
        <div class="event-date-col">
          <div class="month">{new Date(event.date).toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</div>
          <div class="day">{new Date(event.date).getDate()}</div>
          <div class="year">{new Date(event.date).getFullYear()}</div>
        </div>
        <div class="event-info">
          {#if event.featured}<span class="section-label">Featured Event</span>{/if}
          {#if event.eventType}<span class="event-type">{event.eventType}</span>{/if}
          <h3>{event.title}</h3>
          <div class="event-meta">
            <span>📅 {formatDate(event.date)} at {formatTime(event.date)}</span>
            {#if event.location}<span>📍 {event.location}</span>{/if}
          </div>
          {#if event.description}<p class="sm-body" style="margin-top:.75rem;">{event.description}</p>{/if}
          {#if event.websiteUrl}<a href={event.websiteUrl} target="_blank" rel="noopener" class="tlink" style="display:inline-block;margin-top:.75rem;">Event Website →</a>{/if}
        </div>
        <div class="event-cta">
          {#if event.registrationUrl}
            <a href={event.registrationUrl} target="_blank" rel="noopener" class="btn-ember">Register →</a>
          {/if}
        </div>
      </div>
    {/snippet}

    {#if events.length === 0}
      <div class="empty">
        <p>No upcoming events at this time. Check back soon or <a href="mailto:info@gothamdataclinic.org">contact us</a> to stay informed.</p>
      </div>
    {:else}
      {#if upcomingEvents.length > 0}
        <h2 class="events-section-header">Upcoming Events</h2>
        <div class="events-list">
          {#each upcomingEvents as event}
            {@render eventRow(event)}
          {/each}
        </div>
      {/if}

      {#if pastEvents.length > 0}
        <h2 class="events-section-header" style={upcomingEvents.length > 0 ? 'margin-top:3rem;' : ''}>Past Events</h2>
        <div class="events-list">
          {#each pastEvents as event}
            {@render eventRow(event)}
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</section>

<section class="cta-navy">
  <div class="container cta-row">
    <div>
      <h3 style="color:white;">Stay up to date</h3>
      <p style="color:rgba(255,255,255,.55);font-size:.875rem;margin-top:.25rem;">Contact us to be notified of future events and workshops</p>
    </div>
    <a href="mailto:info@gothamdataclinic.org" class="btn-ember">Contact Us →</a>
  </div>
</section>

<style>
.page-hero{background:#1D2B4A;padding:10rem 0 5rem;}
.hero-sub{font-size:1.125rem;line-height:1.7;color:rgba(255,255,255,.65);max-width:40rem;margin-top:1.5rem;}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:white;line-height:1.15;}
h3{font-size:1.25rem;font-weight:700;color:#1D2B4A;margin-bottom:.5rem;}
.sm-body{font-size:.875rem;line-height:1.6;color:#3D4A73;}
.sec-canvas{background:#F3F5FA;padding:5rem 0;}
.events-section-header{font-size:1.25rem;font-weight:800;color:#1D2B4A;margin-bottom:1.5rem;}
.events-list{display:flex;flex-direction:column;gap:1.5rem;}
.event-row{display:grid;grid-template-columns:auto 1fr auto;gap:2rem;align-items:start;background:white;padding:2rem;border:1px solid #DDE2EE;}
@media(max-width:640px){.event-row{grid-template-columns:1fr;}}
.event-date-col{text-align:center;min-width:4rem;}
.month{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#D9581F;}
.day{font-size:2.5rem;font-weight:800;color:#1D2B4A;line-height:1;}
.year{font-size:.75rem;color:#3D4A73;margin-top:.25rem;}
.event-type{display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#3D4A73;background:#F3F5FA;padding:.25rem .5rem;margin-bottom:.5rem;}
.event-meta{display:flex;flex-direction:column;gap:.25rem;font-size:.875rem;color:#3D4A73;margin-top:.5rem;}
.btn-ember{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;background:#D9581F;color:white;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:background .2s;}
.btn-ember:hover{background:#bf4a16;}
.empty{text-align:center;padding:4rem;color:#3D4A73;font-size:1rem;}
.cta-navy{background:#1D2B4A;padding:4rem 0;}
.cta-row{display:flex;flex-direction:column;gap:1.5rem;}
@media(min-width:640px){.cta-row{flex-direction:row;align-items:center;justify-content:space-between;}}
.tlink{font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1D2B4A;border-bottom:2px solid #D9581F;padding-bottom:2px;}
</style>
