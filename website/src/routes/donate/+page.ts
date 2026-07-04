import { getSiteSettings } from '$lib/cms'

export async function load() {
  const settings = await getSiteSettings()
  return { settings: settings ?? {} }
}
