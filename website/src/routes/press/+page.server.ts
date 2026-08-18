import { getPublications } from '$lib/cms'

export async function load() {
  const publications = await getPublications()
  return { publications }
}
