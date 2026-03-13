import { useEffect, useState } from 'react'
import { getUserApplications, type UserApplication } from '../api'

const statusConfig: Record<string, {
  label: string
  bg: string
  text: string
  ring: string
  dot: string
}> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-400',
  },
  reviewed: {
    label: 'Reviewed',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200',
    dot: 'bg-violet-400',
  },
  shortlisted: {
    label: 'Shortlisted',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-200',
    dot: 'bg-indigo-400',
  },
  interviewed: {
    label: 'Interviewed',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
    dot: 'bg-blue-400',
  },
  hired: {
    label: 'Hired',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-200',
    dot: 'bg-red-400',
  },
}

const jobTypeConfig: Record<string, {
  bg: string
  text: string
  ring: string
}> = {
  remote: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  onsite: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' },
  hybrid: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200' },
  fulltime: { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  default: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
}

const getStatusCfg = (status: string) =>
  statusConfig[status.toLowerCase()] ?? {
    label: status,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    ring: 'ring-slate-200',
    dot: 'bg-slate-400',
  }

const getJobTypeCfg = (type: string) =>
  jobTypeConfig[type?.toLowerCase()] ?? jobTypeConfig.default

function AppliedJobs() {
  const [applications, setApplications] = useState<UserApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getUserApplications()
        setApplications(response.data)
      } catch {
        setError('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const formatSalary = (salary: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(salary)

  const uniqueStatuses = [
    'all',
    ...Array.from(new Set(applications.map((a) => a.status.toLowerCase()))),
  ]

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || app.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusCounts = applications.reduce(
    (acc, a) => {
      const key = a.status.toLowerCase()
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 h-14 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              />
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
            <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
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
              onClick={() => window.location.reload()}
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
                  Applications
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                My Applications
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
              </p>
            </div>

            {/* Status summary pills */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => {
                const cfg = getStatusCfg(status)
                return (
                  <span
                    key={status}
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
        {applications.length > 0 && (
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
                  placeholder="Search by job title, company or location…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all focus:outline-none ${
                      filterStatus === s
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s === 'all' ? 'All' : getStatusCfg(s).label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Results count ── */}
        {(searchQuery || filterStatus !== 'all') && (
          <p className="mb-4 text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">{filteredApplications.length}</span>{' '}
            result{filteredApplications.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Empty state ── */}
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700">
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              {applications.length === 0
                ? 'Start applying to jobs and track your progress here.'
                : 'Try adjusting your search or filter.'}
            </p>
            {(searchQuery || filterStatus !== 'all') ? (
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('all') }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            ) : (
              <a
                href="/jobs"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Browse Jobs
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}
          </div>
        ) : (
          /* ── Application Cards ── */
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusCfg = getStatusCfg(application.status)
              const jobTypeCfg = getJobTypeCfg(application.job.jobType)
              const hasTest = application.testAnswered && application.totalquestions > 0
              const scorePercent = hasTest
                ? Math.round(
                    (application.correctedanswers.length / application.totalquestions) * 100
                  )
                : 0
              const scoreColor =
                scorePercent >= 70
                  ? 'bg-emerald-500'
                  : scorePercent >= 40
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              const scoreText =
                scorePercent >= 70
                  ? 'text-emerald-600'
                  : scorePercent >= 40
                  ? 'text-amber-600'
                  : 'text-red-600'

              return (
                <div
                  key={application.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                >
                  {/* Top status bar */}
                  <div className={`h-1 w-full ${statusCfg.dot}`} />

                  <div className="p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* ── Left: Job info ── */}
                      <div className="flex-1 min-w-0">

                        {/* Badges row */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.ring}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                            {statusCfg.label}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${jobTypeCfg.bg} ${jobTypeCfg.text} ${jobTypeCfg.ring}`}
                          >
                            {application.job.jobType}
                          </span>
                          {application.job.jobCategory && (
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {application.job.jobCategory}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-slate-900">
                          {application.job.title}
                        </h2>

                        {/* Company */}
                        <div className="mt-1 flex items-center gap-2">
                          {application.job.company.logo && (
                            <img
                              src={application.job.company.logo}
                              alt={application.job.company.name}
                              className="h-5 w-5 rounded object-cover"
                            />
                          )}
                          <span className="text-sm font-semibold text-indigo-600">
                            {application.job.company.name}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {application.job.description}
                        </p>

                        {/* Meta row */}
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {application.job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatSalary(application.job.salary)}/month
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Deadline: {formatDate(application.job.lastDateToApply)}
                          </span>
                        </div>
                      </div>

                      {/* ── Right: Score + Dates ── */}
                      <div className="flex shrink-0 flex-col gap-3 lg:items-end">

                        {/* Test score card */}
                        {hasTest ? (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Test Score
                            </p>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-slate-900">
                                {application.correctedanswers.length}
                                <span className="text-sm font-medium text-slate-400">
                                  /{application.totalquestions}
                                </span>
                              </span>
                              <span className={`mb-0.5 text-sm font-bold ${scoreText}`}>
                                {scorePercent}%
                              </span>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full transition-all ${scoreColor}`}
                                style={{ width: `${scorePercent}%` }}
                              />
                            </div>
                            <p className="mt-1.5 text-xs text-slate-400">
                              {application.correctedanswers.length} correct ·{' '}
                              {application.totalquestions - application.correctedanswers.length} incorrect
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                            <p className="text-xs font-medium text-slate-400">No test required</p>
                          </div>
                        )}

                        {/* Applied / Updated dates */}
                        <div className="text-right text-xs text-slate-400 space-y-0.5">
                          <p className="flex items-center justify-end gap-1.5">
                            <svg className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Applied {formatDate(application.createdAt)}
                          </p>
                          {application.updatedAt !== application.createdAt && (
                            <p className="flex items-center justify-end gap-1.5">
                              <svg className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Updated {formatDate(application.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppliedJobs