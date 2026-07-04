/**
 * Gotham Data Clinic — CMS Client
 * Fetches content from the self-hosted Payload CMS REST API.
 *
 * The CMS runs at CMS_URL (default: http://localhost:3001)
 * Set the VITE_CMS_URL environment variable to point to your deployed CMS.
 */

const CMS_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:3001'

async function fetchAPI(path: string) {
  try {
    const res = await fetch(`${CMS_URL}/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── Team Members ─────────────────────────────────────────────
export async function getTeamMembers() {
  const data = await fetchAPI('/team-members?limit=50&sort=order')
  return data?.docs ?? []
}

// ── Events ───────────────────────────────────────────────────
export async function getEvents() {
  const data = await fetchAPI('/events?limit=50&sort=date')
  return data?.docs ?? []
}

export async function getUpcomingEvents() {
  const now = new Date().toISOString()
  const data = await fetchAPI(`/events?limit=6&sort=date&where[date][greater_than]=${now}`)
  return data?.docs ?? []
}

// ── Publications ─────────────────────────────────────────────
export async function getPublications() {
  const data = await fetchAPI('/publications?limit=100&sort=-year')
  return data?.docs ?? []
}

// ── Programs ─────────────────────────────────────────────────
export async function getPrograms() {
  const data = await fetchAPI('/programs?limit=20&sort=order')
  return data?.docs ?? []
}

// ── Site Settings ─────────────────────────────────────────────
export async function getSiteSettings() {
  return fetchAPI('/globals/site-settings')
}

// ── Media URL helper ─────────────────────────────────────────
export function mediaUrl(filename: string | null | undefined): string | null {
  if (!filename) return null
  if (filename.startsWith('http')) return filename
  return `${CMS_URL}/media/${filename}`
}

// Populated upload-relation fields (e.g. settings.heroImage) come back from
// Payload as an object with a `url`, not a bare filename.
export function uploadUrl(media: { url?: string | null } | string | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'string') return mediaUrl(media)
  return media.url ? mediaUrl(media.url) : null
}

// Decorative image fallbacks used before an admin sets the corresponding
// SiteSettings upload field — real assets already in the Media library,
// replacing the redesign template's placeholder `/manus-storage/...` paths
// (which never resolved to anything).
const SUPABASE_MEDIA_BASE = 'https://hfzcajwujpczyzlfsytx.supabase.co/storage/v1/object/public/media'
export const FALLBACK_IMAGES = {
  heroBg: `${SUPABASE_MEDIA_BASE}/main.jpeg`,
  missionVisual: `${SUPABASE_MEDIA_BASE}/app_home.png`,
  brainwaves: `${SUPABASE_MEDIA_BASE}/brainwaves_app_full_screen.png`,
  programsNetwork: `${SUPABASE_MEDIA_BASE}/brainwaves_app.png`,
}
