import type { Payload } from 'payload'

// Media.access.read is `() => true` and the S3 plugin serves files straight
// from Supabase's public bucket URL (disablePayloadAccessControl: true,
// see payload.config.ts) — none of that goes through Payload at request
// time, so if someone flips the bucket's "public" toggle off in the
// Supabase dashboard, every image/PDF on the site 404s with nothing in this
// codebase ever noticing. Exercise the real path once on boot: fetch an
// existing file's public URL and log loudly if it's not reachable.
export async function checkMediaBucketPublic(payload: Payload) {
  try {
    const { docs } = await payload.find({ collection: 'media', limit: 1, depth: 0 })
    const url = docs[0]?.url
    if (!url) return // nothing uploaded yet — nothing to verify

    const res = await fetch(url, { method: 'HEAD' })
    if (!res.ok) {
      payload.logger.error(
        `Media bucket public-access check failed: ${url} returned ${res.status}. ` +
          'The Supabase "media" bucket may have been switched to private in the dashboard — ' +
          'every image and PDF on the live site will 404 until it is made public again.',
      )
    }
  } catch (err) {
    payload.logger.error({ err }, 'Media bucket public-access check failed to run')
  }
}
