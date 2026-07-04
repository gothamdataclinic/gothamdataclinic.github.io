import { getPrograms, getUpcomingEvents, getMostRecentPastEvent } from '$lib/cms'

export async function load() {
  const [programs, upcomingEvents] = await Promise.all([getPrograms(), getUpcomingEvents()])
  let featuredEvent = upcomingEvents.find((e: any) => e.featured) ?? upcomingEvents[0] ?? null
  let isPastEvent = false

  if (!featuredEvent) {
    featuredEvent = await getMostRecentPastEvent()
    isPastEvent = Boolean(featuredEvent)
  }

  return { programs, featuredEvent, isPastEvent }
}
