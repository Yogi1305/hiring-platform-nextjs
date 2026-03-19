import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DASHBOARD_LOCK_COOKIE = 'dashboard_lock'
const AUTH_MODE_COOKIE = 'auth_mode'

const dashboardSegments = new Set([
  'home',
  'create-job',
  'applied-students',
  'interviewed-students',
  'employees',
  'questionbank',
])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDashboardPath = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  const authMode = request.cookies.get(AUTH_MODE_COOKIE)?.value

  // Force dashboard child pages to always stay under /dashboard/*
  const [, firstSegment, ...restSegments] = pathname.split('/')

  if (firstSegment && dashboardSegments.has(firstSegment)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/dashboard/${firstSegment}${restSegments.length ? `/${restSegments.join('/')}` : ''}`
    return NextResponse.redirect(redirectUrl)
  }

  // Normal users cannot access company routes.
  if (authMode === 'normal') {
    if (isDashboardPath || pathname.startsWith('/employeer')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    const response = NextResponse.next()
    response.cookies.delete(DASHBOARD_LOCK_COOKIE)
    return response
  }

  // Company users are restricted to dashboard routes only.
  if (authMode === 'company') {
    if (!isDashboardPath) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    const response = NextResponse.next()
    response.cookies.set(DASHBOARD_LOCK_COOKIE, '1', {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    })
    return response
  }

  // Clear stale lock cookie for unauthenticated / unknown mode sessions.
  const hasDashboardLock = request.cookies.get(DASHBOARD_LOCK_COOKIE)?.value === '1'
  if (hasDashboardLock) {
    const response = NextResponse.next()
    response.cookies.delete(DASHBOARD_LOCK_COOKIE)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
