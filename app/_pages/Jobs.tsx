"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import api from '../api'
import ApplicationModal from '../_components/ApplicationModal'
import JobCard from '../_components/JobCard'

export interface FormField {
  id: string
  label: string
  type: string
  required: boolean
}

export interface JobForm {
  id: string
  form: {
    fields: FormField[]
  }
}

export interface Question {
  id: string
  questionText: string
  options: string[]
}

export interface JobTest {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface Company {
  id: string
  companyName: string
  location: string
  industry: string
  website: string
}

export interface Job {
  id: string
  title: string
  description: string
  location: string
  salary: number
  jobType: string
  jobCategory: string
  duration: string
  lastDateToApply: string
  isPublic: boolean
  companyId: string
  test?: JobTest
  form?: JobForm
  company?: Company
}

// ─── Skeleton Card ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Company row */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      {/* Title */}
      <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
      {/* Badges row */}
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-slate-100" />
      </div>
      {/* Description lines */}
      <div className="mb-5 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-slate-100" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center
                    rounded-2xl border border-dashed border-slate-300
                    bg-white py-24 text-center">
      {/* Icon container */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center
                      rounded-2xl border border-dashed border-slate-300 bg-slate-50">
        <svg
          className="h-8 w-8 text-slate-400"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18
               a48.194 48.194 0 01-6.378.424 48.194 48.194 0
               01-6.378-.424c-1.085-.144-1.872-1.086-1.872-2.18
               v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706
               c0-1.081-.768-2.015-1.837-2.175
               a48.114 48.114 0 00-3.413-.387
               m4.5 8.006c-.194.165-.42.295-.673.38
               A23.978 23.978 0 0112 15.75
               c-2.648 0-5.195-.429-7.577-1.22
               a2.016 2.016 0 01-.673-.38
               m0 0A2.18 2.18 0 013 12.489V8.706
               c0-1.081.768-2.015 1.837-2.175
               a48.111 48.111 0 013.413-.387
               m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3
               a2.25 2.25 0 00-2.25 2.25v.894
               m7.5 0a48.667 48.667 0 00-7.5 0
               M12 12.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-800">
        No Jobs Available
      </h3>
      <p className="max-w-xs text-sm text-slate-500">
        There are no public job listings right now.
        Check back soon for new opportunities.
      </p>
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-10
                    shadow-sm text-center">
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center
                      rounded-full bg-red-50">
        <svg className="h-6 w-6 text-red-500" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0
               11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-800">
        Something went wrong
      </h3>
      <p className="mb-6 text-sm text-slate-500">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm
                   font-semibold text-white shadow-sm transition-colors
                   hover:bg-indigo-700 focus:outline-none focus:ring-2
                   focus:ring-indigo-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────
function StatsBar({ jobs }: { jobs: Job[] }) {
  const publicCount  = jobs.length
  const categories   = new Set(jobs.map((j) => j.jobCategory)).size
  const companies    = new Set(jobs.map((j) => j.companyId)).size

  const stats = [
    { label: "Open Roles",  value: publicCount },
    { label: "Categories",  value: categories  },
    { label: "Companies",   value: companies   },
  ]

  return (
    <div className="mb-8 grid grid-cols-3 gap-4 sm:gap-6">
      {stats.map(({ label, value }) => (
        <div key={label}
          className="rounded-2xl border border-slate-200 bg-white
                     p-5 shadow-sm text-center">
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase
                        tracking-widest text-slate-500">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Page Header ──────────────────────────────────────────────────
function PageHeader({
  jobCount,
  onNavigate,
  search,
  onSearchChange,
}: {
  jobCount: number
  onNavigate: () => void
  search: string
  onSearchChange: (v: string) => void
}) {
  return (
    <header className="mb-8">
      {/* Top row */}
      <div className="mb-6 flex flex-col gap-4
                      sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* Label */}
          <span className="mb-2 inline-flex items-center gap-1.5
                           rounded-full border border-indigo-200
                           bg-indigo-50 px-3 py-1
                           text-xs font-semibold uppercase
                           tracking-widest text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500
                             animate-pulse" />
            Live Listings
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Available Jobs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {jobCount > 0
              ? `${jobCount} opportunit${jobCount === 1 ? 'y' : 'ies'} waiting for you`
              : 'Find your next opportunity and apply today'}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onNavigate}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl
                     border border-indigo-200 bg-indigo-50 px-5 py-2.5
                     text-sm font-semibold text-indigo-700
                     transition-colors hover:bg-indigo-100
                     focus:outline-none focus:ring-2
                     focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0
                 01-2-2V5a2 2 0 012-2h5.586a1 1 0
                 01.707.293l5.414 5.414a1 1 0
                 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          My Applications
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2
                     -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0
               105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, company, or category…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200
                     bg-slate-50 py-2.5 pl-11 pr-4 text-sm
                     text-slate-700 placeholder-slate-400
                     transition-colors focus:border-indigo-400
                     focus:bg-white focus:outline-none
                     focus:ring-2 focus:ring-indigo-100"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       rounded-md p-1 text-slate-400
                       hover:text-slate-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
function Jobs() {
  const navigate                    = useRouter()
  const [jobs, setJobs]             = useState<Job[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch]         = useState('')

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/jobs/browse')
      const companies = response.data.data
      const allJobs: Job[] = []
      for (const company of companies) {
        for (const job of company.jobs || []) {
          allJobs.push({
            ...job,
            company: {
              id:          company.id,
              companyName: company.companyName,
              location:    company.location,
              industry:    company.industry,
              website:     company.website,
            },
          })
        }
      }
      setJobs(allJobs)
      setError(null)
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply       = (job: Job) => { setSelectedJob(job); setIsModalOpen(true)  }
  const handleCloseModal  = ()          => { setIsModalOpen(false); setSelectedJob(null) }

  // Client-side search filter
  const filtered = jobs.filter((job) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      job.title.toLowerCase().includes(q)            ||
      job.jobCategory.toLowerCase().includes(q)      ||
      job.company?.companyName.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl
                       px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Loading ── */}
        {loading && (
          <>
            {/* Skeleton header */}
            <div className="mb-8">
              <div className="mb-2 h-4 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mb-3 h-8 w-52 animate-pulse rounded-lg  bg-slate-200" />
              <div className="mb-6 h-3 w-48 animate-pulse rounded     bg-slate-100" />
              <div className="h-10 w-full animate-pulse rounded-xl    bg-slate-200" />
            </div>

            {/* Skeleton stats */}
            <div className="mb-8 grid grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n}
                  className="rounded-2xl border border-slate-200
                             bg-white p-5 shadow-sm">
                  <div className="mx-auto mb-2 h-7 w-12
                                  animate-pulse rounded bg-slate-200" />
                  <div className="mx-auto h-2.5 w-20
                                  animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>

            {/* Skeleton grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <ErrorState message={error} onRetry={fetchJobs} />
        )}

        {/* ── Content ── */}
        {!loading && !error && (
          <>
            <PageHeader
              jobCount={filtered.length}
              onNavigate={() => navigate.push('/applied-jobs')}
              search={search}
              onSearchChange={setSearch}
            />

            <StatsBar jobs={jobs} />

            {/* Results label */}
            {search && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  {filtered.length === 0
                    ? 'No results for'
                    : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for`}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5
                                 text-sm font-semibold text-slate-700">
                  "{search}"
                </span>
              </div>
            )}

            {/* Grid / Empty */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.length === 0
                ? <EmptyState />
                : filtered.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={handleApply}
                    />
                  ))
              }
            </div>
          </>
        )}
      </main>

      {/* ── Modal ── */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default Jobs