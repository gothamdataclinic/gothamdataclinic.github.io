// `request.url` reflects the Host header Next.js's own server received, not
// the public-facing host — behind Render's proxy that can resolve to the
// container's internal `localhost:<PORT>` address instead of the real
// domain. Render (like most reverse proxies) sets X-Forwarded-Host/Proto to
// the original request, so trust those when present.
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) {
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
    return `${forwardedProto}://${forwardedHost}`
  }
  return new URL(request.url).origin
}
