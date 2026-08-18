import { getEvents } from '$lib/cms'

export async function load() {
  const events = await getEvents()
  return { events }
}
