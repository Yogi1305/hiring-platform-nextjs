"use client"

import { useEffect, useState } from 'react'
import { getCompanyJobsWithApplicants, updateApplicationStatus } from '@/app/api'
import type { Applicant, JobWithApplicants } from '@/app/api'

const STATUS_OPTIONS = ['shortlisted', 'selected', 'rejected'] as const

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; ring: string; dot: string }
> = {
  shortlisted: {
    label: 'Shortlisted',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-400',
  },
  selected: {
    label: 'Selected',
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

export default function InterviewedStudentsPage() {
  const [jobs, setJobs] = useState<JobWithApplicants[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [notesByApplication, setNotesByApplication] = useState<Record<string, string>>({})
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const response = await getCompanyJobsWithApplicants()
        const filtered = response.data.data.jobs
          .map((job) => ({
            ...job,
            applicants: job.applicants.filter((a) =>
              STATUS_OPTIONS.includes(
                a.status.toLowerCase() as (typeof STATUS_OPTIONS)[number]
              )
            ),
          }))
          .filter((job) => job.applicants.length > 0)
        setJobs(filtered)
        setNotesByApplication(
          filtered.reduce<Record<string, string>>((acc, job) => {
            job.applicants.forEach((applicant) => {
              acc[applicant.applicationId] = applicant.notes || ''
            })
            return acc
          }, {})
        )
        // Expand all jobs by default
        setExpandedJobs(new Set(filtered.map((j) => j.id)))
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to load interviewed students'
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const updateStatus = async (applicationId: string, status: string, notes?: string) => {
    setUpdatingId(applicationId)
    try {
      await updateApplicationStatus(applicationId, status, notes)
      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          applicants: job.applicants.map((app) =>
            app.applicationId === applicationId ? { ...app, status, notes } : app
          ),
        }))
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleJob = (jobId: string) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev)
      next.has(jobId) ? next.delete(jobId) : next.add(jobId)
      return next
    })
  }

  const totalCandidates = jobs.reduce((sum, j) => sum + j.applicants.length, 0)
  const statusCounts = jobs.reduce(
    (acc, job) => {
      job.applicants.forEach((a) => {
        const key = a.status.toLowerCase()
        if (key in acc) acc[key as keyof typeof acc]++
      })
      return acc
    },
    { shortlisted: 0, selected: 0, rejected: 0 }
  )

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-900">Interviewed Students</h1>
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
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Hiring Pipeline
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Interviewed Students
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {totalCandidates} candidate{totalCandidates !== 1 ? 's' : ''} across{' '}
                {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Status summary pills */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(statusCounts) as (keyof typeof statusCounts)[]).map((key) => {
                const cfg = statusConfig[key]
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {statusCounts[key]} {cfg.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {jobs.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700">No interviewed students yet</h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              Candidates will appear here once they are shortlisted, selected, or rejected.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => {
              const isExpanded = expandedJobs.has(job.id)
              const jobStatusCounts = job.applicants.reduce(
                (acc, a) => {
                  const key = a.status.toLowerCase()
                  if (key in acc) acc[key as keyof typeof acc]++
                  return acc
                },
                { shortlisted: 0, selected: 0, rejected: 0 }
              )

              return (
                <div
                  key={job.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* ── Job Header ── */}
                  <button
                    onClick={() => toggleJob(job.id)}
                    className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900">{job.title}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {job.applicants.length} candidate{job.applicants.length !== 1 ? 's' : ''}
                          </span>
                          {(Object.keys(jobStatusCounts) as (keyof typeof jobStatusCounts)[])
                            .filter((k) => jobStatusCounts[k] > 0)
                            .map((k) => {
                              const cfg = statusConfig[k]
                              return (
                                <span
                                  key={k}
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                  {jobStatusCounts[k]} {cfg.label}
                                </span>
                              )
                            })}
                        </div>
                      </div>
                    </div>

                    {/* Chevron */}
                    <svg
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* ── Applicants List ── */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-100">
                      {job.applicants.map((applicant: Applicant) => {
                        const cfg = statusConfig[applicant.status.toLowerCase()] ?? statusConfig.shortlisted
                        const isUpdating = updatingId === applicant.applicationId
                        const initials = applicant.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()

                        return (
                          <div
                            key={applicant.applicationId}
                            className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                          >
                            {/* Avatar + info */}
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                                {initials}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {applicant.user.name}
                                </p>
                                <p className="text-xs text-slate-400">{applicant.user.email}</p>
                              </div>
                            </div>

                            {/* Right side: current status badge + notes + select */}
                            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                              {/* Current status badge */}
                              <span
                                className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 sm:inline-flex ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                              </span>

                              <input
                                type="text"
                                placeholder="Add notes"
                                value={notesByApplication[applicant.applicationId] ?? ''}
                                onChange={(e) =>
                                  setNotesByApplication((prev) => ({
                                    ...prev,
                                    [applicant.applicationId]: e.target.value,
                                  }))
                                }
                                disabled={isUpdating}
                                className="w-full min-w-55 max-w-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                              />

                              {/* Status dropdown */}
                              <div className="relative">
                                <select
                                  value={applicant.status.toLowerCase()}
                                  onChange={(e) =>
                                    updateStatus(
                                      applicant.applicationId,
                                      e.target.value,
                                      notesByApplication[applicant.applicationId]?.trim() || undefined
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-sm font-medium text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                                >
                                  {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                      {statusConfig[status].label}
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
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}