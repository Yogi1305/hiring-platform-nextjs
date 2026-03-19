"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { logoutUser } from '../api'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const [authMode, setAuthMode] = useState<'normal' | 'company' | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const modeMatch = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_mode='))
      ?.split('=')[1]

    if (modeMatch === 'normal' || modeMatch === 'company') {
      setAuthMode(modeMatch)
      return
    }

    setAuthMode(null)
  }, [pathname])

  if (isDashboardRoute) {
    return null
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    let requestFailed = false
    try {
      await logoutUser()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout request failed:', error)
      requestFailed = true
    } finally {
      document.cookie = 'dashboard_lock=; Max-Age=0; path=/; SameSite=Lax'
      document.cookie = 'auth_mode=; Max-Age=0; path=/; SameSite=Lax'
      if (requestFailed) {
        toast.error('Logout request failed, but local session was cleared')
      }
      setAuthMode(null)
      router.replace('/login')
      setIsLoggingOut(false)
    }
  }

  const navItemClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          HireMe
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          <li>
            <Link href="/" className={navItemClass('/')}>Home</Link>
          </li>
          <li>
            <Link href="/jobs" className={navItemClass('/jobs')}>Jobs</Link>
          </li>
          {authMode !== 'normal' && (
            <li>
              <Link href="/employeer" className={navItemClass('/employeer')}>Employeer</Link>
            </li>
          )}
          {authMode && (
            <li>
              <Link href="/profile" className={navItemClass('/profile')}>Profile</Link>
            </li>
          )}
          {authMode ? (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" className={navItemClass('/login')}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
