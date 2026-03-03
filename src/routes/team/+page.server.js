export const load = async ({ url, fetch }) => {
	const teamRes = await fetch(`${url.origin}/api/team.json`)
	const team = await teamRes.json()

	return { team }
}
