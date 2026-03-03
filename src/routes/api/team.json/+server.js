import { json } from '@sveltejs/kit'

export const prerender = true

const fetchTeam = async () => {

	const team = await Promise.all(
		Object.entries(import.meta.glob('/src/lib/content/bios/*.md')).map(async ([path, resolver]) => {
			const md = await resolver()

			return { metadata: md.metadata, description: md.default }
		})
	)

  return { team }
}

export const GET = async () => {

  const { team } = await fetchTeam()
  return json(team)
	// return json({})
}