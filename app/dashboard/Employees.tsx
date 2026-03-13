"use client"

import { useState, useEffect } from 'react'
import { getCompanyEmployees } from '../api'
import type { Employee } from '../api'

const roleConfig: Record<string, {
  label: string
  bg: string
  text: string
  ring: string
  dot: string
}> = {
  admin: {
    label: 'Admin',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200',
    dot: 'bg-violet-400',
  },
  hr: {
    label: 'HR',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
    dot: 'bg-blue-400',
  },
  interviewer: {
    label: 'Interviewer',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-400',
  },
  default: {
    label: 'Member',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    ring: 'ring-slate-200',
    dot: 'bg-slate-400',
  },
}

const getRoleCfg = (role: string) =>
  roleConfig[role.toLowerCase()] ?? roleConfig.default

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await getCompanyEmployees()
      setEmployees(response.data.data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  const uniqueRoles = ['all', ...Array.from(new Set(employees.map((e) => e.role.toLowerCase())))]

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || emp.role.toLowerCase() === filterRole
    return matchesSearch && matchesRole
  })

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-52 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 h-14 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-12 animate-pulse border-b border-slate-100 bg-slate-50" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-0"
              >
                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="h-6 w-16 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-semibold text-slate-800">Something went wrong</h3>
            <p className="mb-6 text-sm text-slate-500">{error}</p>
            <button
              onClick={fetchEmployees}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Team
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Employees
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {employees.length} team member{employees.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Role summary pills */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(roleConfig)
                .filter((r) => r !== 'default')
                .map((role) => {
                  const count = employees.filter(
                    (e) => e.role.toLowerCase() === role
                  ).length
                  if (count === 0) return null
                  const cfg = roleConfig[role]
                  return (
                    <span
                      key={role}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {count} {cfg.label}
                    </span>
                  )
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Search & Filter Bar ── */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email or phone…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all focus:outline-none ${
                    filterRole === role
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role === 'all' ? 'All' : getRoleCfg(role).label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results count ── */}
        {(searchQuery || filterRole !== 'all') && (
          <p className="mb-4 text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">{filteredEmployees.length}</span>{' '}
            result{filteredEmployees.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Empty state ── */}
        {filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700">
              {employees.length === 0 ? 'No employees yet' : 'No matching employees'}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              {employees.length === 0
                ? 'Share your company code so employees can register and join your team.'
                : 'Try adjusting your search or filter.'}
            </p>
            {(searchQuery || filterRole !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setFilterRole('all') }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ── Desktop Table ── */}
            <div className="hidden md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Employee', 'Phone', 'Role', 'Company Code', 'Joined'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((employee) => {
                    const cfg = getRoleCfg(employee.role)
                    const initials = employee.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()

                    return (
                      <tr key={employee.id} className="transition hover:bg-slate-50">

                        {/* Employee */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{employee.name}</p>
                              <p className="text-xs text-slate-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4">
                          {employee.phone ? (
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {employee.phone}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-300">—</span>
                          )}
                        </td>

                        {/* Role badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Company Code */}
                        <td className="px-6 py-4">
                          <code className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-slate-600">
                            {employee.companyCode}
                          </code>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(employee.createdAt)}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredEmployees.map((employee) => {
                const cfg = getRoleCfg(employee.role)
                const initials = employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()

                return (
                  <div key={employee.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{employee.name}</p>
                          <p className="text-xs text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                      {employee.phone && (
                        <span className="flex items-center gap-1">
                          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {employee.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(employee.createdAt)}
                      </span>
                      <code className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold tracking-widest text-slate-600">
                        {employee.companyCode}
                      </code>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Table footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
              <p className="text-xs text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-600">{filteredEmployees.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{employees.length}</span> employees
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Employees