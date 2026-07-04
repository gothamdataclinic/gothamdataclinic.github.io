import { getPrograms, getUpcomingEvents } from '$lib/cms'

export async function load() {
  const [programs, upcomingEvents] = await Promise.all([getPrograms(), getUpcomingEvents()])
  const featuredEvent = upcomingEvents.find((e: any) => e.featured) ?? upcomingEvents[0] ?? null
  return { programs, featuredEvent }
}
