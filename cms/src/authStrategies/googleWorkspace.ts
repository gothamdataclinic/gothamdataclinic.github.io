import type { AuthStrategy } from 'payload'
import { createServerClient, parseCookieHeader } from '@supabase/ssr'

import { ALLOWED_EMAIL_DOMAIN } from '@/lib/allowedEmailDomain'

export const googleWorkspaceStrategy: AuthStrategy = {
  name: 'google-workspace',
  authenticate: async ({ headers, payload }) => {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(headers.get('cookie') ?? '').filter(
              (cookie): cookie is { name: string; value: string } => cookie.value !== undefined,
            )
          },
          setAll() {
            // No-op: this is a read-only check on an incoming request, not a
            // response we control. A refreshed token simply won't persist
            // here — the session still expires normally and the user
            // re-authenticates with one click.
          },
        },
      },
    )

    // getUser() revalidates against Supabase's Auth server rather than just
    // trusting the local JWT — the right call for a security check.
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user?.email) return { user: null }

    // Defense in depth: the OAuth callback already rejects non-org emails,
    // but re-check here too since this is the actual gate on every request.
    if (!data.user.email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN.toLowerCase()}`)) {
      return { user: null }
    }

    let result = await payload.find({
      collection: 'users',
      where: { email: { equals: data.user.email } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      const created = await payload.create({
        collection: 'users',
        data: {
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email,
          password: crypto.randomUUID(),
        },
      })
      return { user: { ...created, collection: 'users' } }
    }

    return { user: { ...result.docs[0], collection: 'users' } }
  },
}
