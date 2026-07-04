import { getTeamMembers } from '$lib/cms'

export async function load() {
  const team = await getTeamMembers()
  return { team }
}
