import { NextResponse } from 'next/server'

import { ALLOWED_EMAIL_DOMAIN } from '@/lib/allowedEmailDomain'
import { getRequestOrigin } from '@/lib/getRequestOrigin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = getRequestOrigin(request)
  const code = searchParams.get('code')
  const loginErrorUrl = new URL('/admin/login', origin)

  if (!code) {
    loginErrorUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(loginErrorUrl)
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    loginErrorUrl.searchParams.set('error', 'exchange_failed')
    return NextResponse.redirect(loginErrorUrl)
  }

  // The actual security boundary: verify the Google-verified email ends in
  // the allowed Workspace domain. Reject and immediately sign out — don't
  // leave a live Supabase session around for a non-org account, even though
  // the Payload auth strategy re-checks this on every request too.
  const email = data.user.email
  const emailVerified = data.user.user_metadata?.email_verified
  if (!email || !emailVerified || !email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN.toLowerCase()}`)) {
    await supabase.auth.signOut()
    loginErrorUrl.searchParams.set('error', 'domain_not_allowed')
    return NextResponse.redirect(loginErrorUrl)
  }

  return NextResponse.redirect(new URL('/admin', origin))
}
