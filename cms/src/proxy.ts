import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getRequestOrigin } from '@/lib/getRequestOrigin'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/admin', getRequestOrigin(request)))
}

export const config = {
  matcher: '/',
}
