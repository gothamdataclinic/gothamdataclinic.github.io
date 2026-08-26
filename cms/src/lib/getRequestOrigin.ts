// `request.url` reflects the Host header Next.js's own server received, not
// the public-facing host — behind a reverse proxy (Vercel's edge network,
// or previously Render's) that can resolve to an internal address instead
// of the real domain. These platforms set X-Forwarded-Host/Proto to the
// original request, so trust those when present.
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) {
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
    return `${forwardedProto}://${forwardedHost}`
  }
  return new URL(request.url).origin
}
