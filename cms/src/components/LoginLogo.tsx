'use client'

import React from 'react'

// Hidden failsafe: clicking the logo reveals the local email/password login
// form (see custom.scss), for the break-glass account when Google/Supabase
// Auth is unavailable. Not advertised in the UI on purpose.
export const LoginLogo: React.FC = () => (
  <button
    type="button"
    onClick={() => document.body.classList.toggle('reveal-local-login')}
    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/gdc_logo.png" alt="Gotham Data Clinic" style={{ height: '48px', width: 'auto' }} />
  </button>
)
