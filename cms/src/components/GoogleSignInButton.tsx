'use client'

import React from 'react'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export const GoogleSignInButton: React.FC = () => {
  const handleClick = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          // UX hint only — Google's account chooser suggests the org
          // domain, but the callback route re-verifies the returned email
          // server-side regardless of this parameter.
          hd: 'gothamdataclinic.org',
        },
      },
    })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        type="button"
        onClick={handleClick}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'center',
          padding: '0.75rem',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer',
          background: 'none',
        }}
      >
        Sign in with Google (@gothamdataclinic.org)
      </button>
    </div>
  )
}
