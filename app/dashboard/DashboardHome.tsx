import { useEffect, useState } from 'react'
import { fetchAllJobs, toggleJobPublic } from '../api'
import type { Job } from '../jobs/page.tsx'

function DashboardHome() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await fetchAllJobs()
      setJobs(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch jobs.')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublic = async (jobId: string) => {
    setTogglingId(jobId)
    try {
      await toggleJobPublic(jobId)
      await fetchJobs()
    } catch (err) {
      setError('Failed to update job visibility.')
    } finally {
      setTogglingId(null)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVisibility =
      filterVisibility === 'all' ||
      (filterVisibility === 'public' && job.isPublic) ||
      (filterVisibility === 'private' && !job.isPublic)
    return matchesSearch && matchesVisibility
  })

  const publicCount = jobs.filter((j) => j.isPublic).length
  const privateCount = jobs.filter((j) => !j.isPublic).length

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-60 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 h-14 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-0"
              >
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
                <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
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
            <h1 className="text-2xl font-bold text-slate-900">Manage Jobs</h1>
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
              onClick={fetchJobs}
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
                  Job Management
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Manage Jobs
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
              </p>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {publicCount} Public
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                {privateCount} Private
              </span>
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
                placeholder="Search by title or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'public', 'private'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilterVisibility(v)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all focus:outline-none ${
                    filterVisibility === v
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results count ── */}
        {(searchQuery || filterVisibility !== 'all') && (
          <p className="mb-4 text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">{filteredJobs.length}</span>{' '}
            result{filteredJobs.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Empty state ── */}
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700">
              {jobs.length === 0 ? 'No jobs found' : 'No matching jobs'}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              {jobs.length === 0
                ? 'Create your first job listing to get started.'
                : 'Try adjusting your search or filter.'}
            </p>
            {(searchQuery || filterVisibility !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setFilterVisibility('all') }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* ── Jobs Table Card ── */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Table — desktop */}
            <div className="hidden md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Job
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Salary
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Visibility
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => {
                    const isToggling = togglingId === job.id
                    return (
                      <tr key={job.id} className="group transition hover:bg-slate-50">

                        {/* Job title + icon */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-slate-900">{job.title}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </div>
                        </td>

                        {/* Salary */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                          </div>
                        </td>

                        {/* Visibility badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                              job.isPublic
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                : 'bg-slate-100 text-slate-500 ring-slate-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                job.isPublic ? 'bg-emerald-400' : 'bg-slate-400'
                              }`}
                            />
                            {job.isPublic ? 'Public' : 'Private'}
                          </span>
                        </td>

                        {/* Toggle button */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleTogglePublic(job.id)}
                            disabled={isToggling}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              job.isPublic
                                ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-400'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                            }`}
                          >
                            {isToggling ? (
                              <>
                                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Updating…
                              </>
                            ) : job.isPublic ? (
                              <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                Make Private
                              </>
                            ) : (
                              <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Make Public
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list ── */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredJobs.map((job) => {
                const isToggling = togglingId === job.id
                return (
                  <div key={job.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.location}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          job.isPublic
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-slate-100 text-slate-500 ring-slate-200'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${job.isPublic ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                        {job.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-slate-500">{job.salary}</span>
                      <button
                        onClick={() => handleTogglePublic(job.id)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all focus:outline-none disabled:opacity-50 ${
                          job.isPublic
                            ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isToggling ? (
                          <>
                            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Updating…
                          </>
                        ) : job.isPublic ? 'Make Private' : 'Make Public'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Table footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filteredJobs.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{jobs.length}</span> jobs
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardHome