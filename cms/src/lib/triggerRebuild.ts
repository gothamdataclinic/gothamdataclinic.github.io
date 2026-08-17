// Publishing content here doesn't touch the website directly — the site is
// prerendered static HTML (see website/src/routes/+layout.ts) rebuilt by
// GitHub Actions. This fires a repository_dispatch event so a save in the
// CMS kicks off that rebuild instead of requiring a manual `git push`.
// Requires a GITHUB_TOKEN env var (fine-grained PAT, "Contents: read/write"
// and "Actions: read/write" on this repo — see cms/.env.example).
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

const GITHUB_REPO = 'gothamdataclinic/gothamdataclinic'

export async function triggerRebuild() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('triggerRebuild: GITHUB_TOKEN not set, skipping rebuild trigger — this save will NOT appear on the live site until a rebuild runs')
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
      console.error(`triggerRebuild: GitHub API responded ${res.status} ${await res.text()} — this save will NOT appear on the live site until a rebuild runs`)
    }
  } catch (err) {
    console.error('triggerRebuild: failed to reach GitHub API — this save will NOT appear on the live site until a rebuild runs', err)
  }
}

// Shared hook wiring for every collection/global that should kick off a
// rebuild on save. Extracted so the debounce/error-handling behavior above
// only has to change in one place instead of nine.
export const afterChangeRebuildHook: CollectionAfterChangeHook = async ({ doc }) => {
  await triggerRebuild()
  return doc
}

export const afterDeleteRebuildHook: CollectionAfterDeleteHook = async ({ doc }) => {
  await triggerRebuild()
  return doc
}

export const globalAfterChangeRebuildHook: GlobalAfterChangeHook = async ({ doc }) => {
  await triggerRebuild()
  return doc
}
