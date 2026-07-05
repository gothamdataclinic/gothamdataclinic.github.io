/**
 * Gotham Data Clinic — CMS Client
 * Fetches content from the self-hosted Payload CMS REST API.
 *
 * The CMS runs at CMS_URL (default: http://localhost:3000, Next.js's default dev port)
 * Set the VITE_CMS_URL environment variable to point to your deployed CMS.
 */

const CMS_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:3000'

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

export async function getMostRecentPastEvent() {
  const now = new Date().toISOString()
  const data = await fetchAPI(`/events?limit=1&sort=-date&where[date][less_than_equal]=${now}`)
  return data?.docs?.[0] ?? null
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
// The CMS splits page content across several Globals instead of one big
// SiteSettings global, matching the site's routes (see cms/src/globals/).
// This merges them into a single flat object so every page component can
// keep reading `settings.fieldName` regardless of which Global it lives in.
export async function getSiteSettings() {
  const [general, home, about, donate, taxInfo] = await Promise.all([
    fetchAPI('/globals/general'),
    fetchAPI('/globals/home'),
    fetchAPI('/globals/about'),
    fetchAPI('/globals/donate'),
    fetchAPI('/globals/tax-info'),
  ])
  if (!general && !home && !about && !donate && !taxInfo) return null
  return { ...general, ...home, ...about, ...donate, ...taxInfo }
}

// ── Media URL helper ─────────────────────────────────────────
function mediaUrl(filename: string | null | undefined): string | null {
  if (!filename) return null
  if (filename.startsWith('http')) return filename
  return `${CMS_URL}/media/${filename}`
}

// Populated upload-relation fields (e.g. settings.heroImage) come back from
// Payload as an object with a `url`, not a bare filename. Pass `size` to use
// one of Media's generated image sizes (see cms/src/collections/Media.ts)
// instead of the full original — important for things like headshots, where
// the original upload can be several MB but only renders as a small avatar.
type UploadMedia = { url?: string | null; sizes?: Record<string, { url?: string | null } | null | undefined> }
export function uploadUrl(media: UploadMedia | string | null | undefined, size?: 'thumbnail' | 'card'): string | null {
  if (!media) return null
  if (typeof media === 'string') return mediaUrl(media)
  if (size && media.sizes?.[size]?.url) return mediaUrl(media.sizes[size]!.url)
  return media.url ? mediaUrl(media.url) : null
}
