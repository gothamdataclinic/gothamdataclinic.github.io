'use client'

import React from 'react'
import { LogOutIcon, useConfig, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

// Payload's default logout button only clears Payload's own session cookie.
// Our auth strategy (googleWorkspace.ts) re-derives the Payload session from
// the Supabase session on every request, so leaving Supabase's session
// cookies in place silently logs the user back in on the very next request.
// Sign out of Supabase first, then follow the same route Payload's own
// logout link uses.
export const LogoutButton: React.FC<{ tabIndex?: number }> = ({ tabIndex = 0 }) => {
  const { config } = useConfig()
  const { t } = useTranslation()
  const {
    admin: {
      routes: { logout: logoutRoute },
    },
    routes: { admin: adminRoute },
  } = config

  const href = formatAdminURL({ adminRoute, path: logoutRoute })

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = href
  }

  return (
    <a
      aria-label={t('authentication:logOut')}
      className="nav__log-out"
      href={href}
      onClick={handleClick}
      tabIndex={tabIndex}
      title={t('authentication:logOut')}
    >
      <LogOutIcon />
    </a>
  )
}
