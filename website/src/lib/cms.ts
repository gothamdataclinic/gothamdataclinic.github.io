/**
 * Gotham Data Clinic — CMS Client
 * Fetches content from the self-hosted Payload CMS REST API.
 *
 * The CMS runs at CMS_URL (default: http://localhost:3000, Next.js's default dev port)
 * Set the VITE_CMS_URL environment variable to point to your deployed CMS.
 */

const CMS_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:3000'

type UploadMedia = { url?: string | null; sizes?: Record<string, { url?: string | null } | null | undefined> }
export type Upload = UploadMedia | string | null | undefined

export interface TeamMember {
  id: string | number
  name: string
  credentials?: string
  role?: string
  memberType?: 'current' | 'founding'
  photo?: Upload
  bio?: string
  tags?: string[]
  linkedinUrl?: string
  personalSiteUrl?: string
  order?: number
}

export interface Event {
  id: string | number
  title: string
  date: string
  endDate?: string
  location?: string
  description?: string
  registrationUrl?: string
  websiteUrl?: string
  image?: Upload
  eventType?: string
  featured?: boolean
}

export interface Publication {
  id: string | number
  title: string
  authors?: string[]
  journal?: string
  year?: number
  abstract?: string
  doi?: string
  pdfUrl?: string
  publicationType?: string
  featured?: boolean
}

// The CMS's site-settings globals cover a wide, evolving set of per-page
// content fields (hero copy, stats, timelines, FAQs, etc). Rather than
// duplicate that schema here, callers read it as a loose bag of optional
// fields and fall back to static copy when a key is absent.
export type SiteSettings = Record<string, any>

// The build fires a burst of concurrent requests (getSiteSettings alone is
// 5 in parallel, across several pages during prerender), which has
// repeatedly tripped transient 500s on the CMS side — a single failed
// fetch here doesn't just drop one field, it gets baked into the static
// site until the next successful rebuild. Retry a few times with backoff
// before giving up, so a transient blip during the burst self-heals within
// the same build instead of shipping stale/fallback content.
const RETRY_DELAYS_MS = [300, 900]

async function fetchAPI<T = any>(path: string): Promise<T | null> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(`${CMS_URL}/api${path}`, {
        // This is a read-only GET request. Do not send Content-Type here: it
        // turns a simple cross-origin request into a CORS preflight, allowing a
        // transient CMS startup failure to erase already-rendered page content.
        headers: { Accept: 'application/json' },
      })
      if (res.ok) return res.json()
      console.error(`CMS fetch failed (attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}): ${CMS_URL}/api${path} returned ${res.status}`)
    } catch (err) {
      console.error(`CMS fetch failed (attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}): ${CMS_URL}/api${path}`, err)
    }
    if (attempt < RETRY_DELAYS_MS.length) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
    }
  }
  return null
}

type PaginatedDocs<T> = { docs: T[] }

// ── Team Members ─────────────────────────────────────────────
export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await fetchAPI<PaginatedDocs<TeamMember>>('/team-members?limit=50&sort=order')
  return data?.docs ?? []
}

// ── Events ───────────────────────────────────────────────────
export async function getEvents(): Promise<Event[]> {
  const data = await fetchAPI<PaginatedDocs<Event>>('/events?limit=50&sort=date')
  return data?.docs ?? []
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const now = new Date().toISOString()
  const data = await fetchAPI<PaginatedDocs<Event>>(`/events?limit=6&sort=date&where[date][greater_than]=${now}`)
  return data?.docs ?? []
}

export async function getMostRecentPastEvent(): Promise<Event | null> {
  const now = new Date().toISOString()
  const data = await fetchAPI<PaginatedDocs<Event>>(`/events?limit=1&sort=-date&where[date][less_than_equal]=${now}`)
  return data?.docs?.[0] ?? null
}

// ── Publications ─────────────────────────────────────────────
export async function getPublications(): Promise<Publication[]> {
  const data = await fetchAPI<PaginatedDocs<Publication>>('/publications?limit=100&sort=-year')
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
export async function getSiteSettings(): Promise<SiteSettings | null> {
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
export function uploadUrl(media: Upload, size?: 'thumbnail' | 'card'): string | null {
  if (!media) return null
  if (typeof media === 'string') return mediaUrl(media)
  if (size && media.sizes?.[size]?.url) return mediaUrl(media.sizes[size]!.url)
  return media.url ? mediaUrl(media.url) : null
}
