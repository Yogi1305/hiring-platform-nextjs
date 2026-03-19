import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DASHBOARD_LOCK_COOKIE = 'dashboard_lock'

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

  // Force dashboard child pages to always stay under /dashboard/*
  const [, firstSegment, ...restSegments] = pathname.split('/')

  if (firstSegment && dashboardSegments.has(firstSegment)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/dashboard/${firstSegment}${restSegments.length ? `/${restSegments.join('/')}` : ''}`
    return NextResponse.redirect(redirectUrl)
  }

  // Once user is in dashboard, keep navigation restricted to dashboard routes.
  if (isDashboardPath) {
    const response = NextResponse.next()
    response.cookies.set(DASHBOARD_LOCK_COOKIE, '1', {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    })
    return response
  }

  const hasDashboardLock = request.cookies.get(DASHBOARD_LOCK_COOKIE)?.value === '1'
  if (hasDashboardLock) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
