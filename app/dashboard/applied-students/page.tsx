"use client"

import { Applicant, getCompanyJobsWithApplicants, JobWithApplicants, updateApplicationStatus } from '@/app/api'
import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted']

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
  interview: {
    label: 'Interview',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
    dot: 'bg-blue-400',
  },
  accepted: {
    label: 'Accepted',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-400',
  },
  hired: {
    label: 'Hired',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-200',
    dot: 'bg-red-400',
  },
}

const getStatusCfg = (status: string) =>
  statusConfig[status.toLowerCase()] ?? {
    label: status,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    ring: 'ring-slate-200',
    dot: 'bg-slate-400',
  }

function AppliedStudents() {
  const [jobs, setJobs] = useState<JobWithApplicants[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobWithApplicants | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await getCompanyJobsWithApplicants()
      setJobs(response.data.data.jobs)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
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

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId)
    try {
      await updateApplicationStatus(applicationId, newStatus)
      if (selectedJob) {
        const updatedApplicants = selectedJob.applicants.map((app) =>
          app.applicationId === applicationId ? { ...app, status: newStatus } : app
        )
        setSelectedJob({ ...selectedJob, applicants: updatedApplicants })
        setJobs((prev) =>
          prev.map((job) =>
            job.id === selectedJob.id ? { ...job, applicants: updatedApplicants } : job
          )
        )
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-900">Applied Students</h1>
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

  // ── Applicants Detail View ───────────────────────────────────────
  if (selectedJob) {
    const filteredApplicants = selectedJob.applicants.filter((app) => {
      const matchesSearch =
        app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        filterStatus === 'all' || app.status.toLowerCase() === filterStatus
      return matchesSearch && matchesStatus
    })

    const statusCounts = STATUS_OPTIONS.reduce(
      (acc, s) => ({
        ...acc,
        [s]: selectedJob.applicants.filter((a) => a.status.toLowerCase() === s).length,
      }),
      {} as Record<string, number>
    )

    return (
      <div className="min-h-screen bg-slate-50">

        {/* ── Header ── */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Back button */}
            <button
              onClick={() => {
                setSelectedJob(null)
                setSearchQuery('')
                setFilterStatus('all')
              }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Jobs
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                    Applications
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {selectedJob.title}
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  {selectedJob.applicantCount} applicant{selectedJob.applicantCount !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Status summary pills */}
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => {
                  const cfg = getStatusCfg(s)
                  return (
                    <span
                      key={s}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {statusCounts[s] ?? 0} {cfg.label}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Search + filter bar */}
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
                  placeholder="Search by name or email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', ...STATUS_OPTIONS].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all focus:outline-none ${
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

          {/* Results count */}
          {(searchQuery || filterStatus !== 'all') && (
            <p className="mb-4 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filteredApplicants.length}</span> result{filteredApplicants.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Applicant cards */}
          {filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700">No applicants found</h3>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('all') }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplicants.map((applicant: Applicant) => {
                const cfg = getStatusCfg(applicant.status)
                const isUpdating = updatingStatus === applicant.applicationId
                const initials = applicant.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()

                return (
                  <div
                    key={applicant.applicationId}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-5">

                      {/* Left: avatar + info */}
                      <div className="flex flex-1 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{applicant.user.name}</h3>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500">{applicant.user.email}</p>

                          {/* Skills */}
                          {applicant.user.profile?.skills && applicant.user.profile.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {applicant.user.profile.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Social Links */}
                          <div className="mt-3 flex gap-3">
                            {applicant.user.profile?.github && (
                              <a
                                href={applicant.user.profile.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              >
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                              </a>
                            )}
                            {applicant.user.profile?.linkedin && (
                              <a
                                href={applicant.user.profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              >
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: score + date + status selector */}
                      <div className="flex shrink-0 flex-col items-end gap-3">

                        {/* Score card */}
                        {applicant.testScore !== undefined && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right">
                            <p className="text-xs font-medium text-slate-400">Test Score</p>
                            <p className="text-lg font-bold text-slate-900">{applicant.testScore}</p>
                            <p className="text-xs text-slate-400">
                              {applicant.correctAnswers}✓&nbsp; {applicant.incorrectAnswers}✗
                            </p>
                          </div>
                        )}

                        {/* Applied date */}
                        <p className="text-xs text-slate-400">
                          Applied {formatDate(applicant.appliedAt)}
                        </p>

                        {/* Status dropdown */}
                        <div className="relative">
                          <select
                            value={applicant.status.toLowerCase()}
                            onChange={(e) =>
                              handleStatusChange(applicant.applicationId, e.target.value)
                            }
                            disabled={isUpdating}
                            className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-sm font-medium text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {getStatusCfg(s).label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                            {isUpdating ? (
                              <svg className="h-3.5 w-3.5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
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

  // ── Jobs List View ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Applications
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Applied Students
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} ·{' '}
                {jobs.reduce((sum, j) => sum + j.applicantCount, 0)} total applicants
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700">No jobs found</h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              Post a job to start receiving applications from candidates.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              const totalApplicants = job.applicantCount
              const statusBreakdown = STATUS_OPTIONS.reduce(
                (acc, s) => ({
                  ...acc,
                  [s]: job.applicants?.filter((a) => a.status.toLowerCase() === s).length ?? 0,
                }),
                {} as Record<string, number>
              )

              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {/* Icon + applicant count */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      {totalApplicants} applicant{totalApplicants !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">
                    {job.title}
                  </h3>

                  {/* Mini status breakdown */}
                  {totalApplicants > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {STATUS_OPTIONS.filter((s) => statusBreakdown[s] > 0).map((s) => {
                        const cfg = getStatusCfg(s)
                        return (
                          <span
                            key={s}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {statusBreakdown[s]} {cfg.label}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                    View applicants
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppliedStudents