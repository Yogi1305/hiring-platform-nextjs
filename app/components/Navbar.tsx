"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname() || '/'

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
          <li>
            <Link href="/employeer" className={navItemClass('/employeer')}>Employeer</Link>
          </li>
          <li>
            <Link href="/profile" className={navItemClass('/profile')}>Profile</Link>
          </li>
          <li>
            <Link href="/login" className={navItemClass('/login')}>Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
