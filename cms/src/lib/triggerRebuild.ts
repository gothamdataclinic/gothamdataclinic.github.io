// Publishing content here doesn't touch the website directly — the site is
// prerendered static HTML (see website/src/routes/+layout.ts) rebuilt by
// GitHub Actions. This fires a repository_dispatch event so a save in the
// CMS kicks off that rebuild instead of requiring a manual `git push`.
// Requires a GITHUB_TOKEN env var (fine-grained PAT, "Contents: read/write"
// and "Actions: read/write" on this repo — see cms/.env.example).
const GITHUB_REPO = 'gothamdataclinic/gothamdataclinic'

export async function triggerRebuild() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.warn('triggerRebuild: GITHUB_TOKEN not set, skipping rebuild trigger')
    return
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'cms-content-updated' }),
    })
    if (!res.ok) {
      console.warn(`triggerRebuild: GitHub API responded ${res.status} ${await res.text()}`)
    }
  } catch (err) {
    console.warn('triggerRebuild: failed to reach GitHub API', err)
  }
}
