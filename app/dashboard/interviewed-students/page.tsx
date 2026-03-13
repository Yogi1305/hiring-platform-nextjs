"use client"

import { useEffect, useState } from 'react'
import { getCompanyJobsWithApplicants, updateApplicationStatus } from '@/app/api'
import type { Applicant, JobWithApplicants } from '@/app/api'

const STATUS_OPTIONS = ['shortlisted', 'selected', 'rejected'] as const

export default function InterviewedStudentsPage() {
  const [jobs, setJobs] = useState<JobWithApplicants[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const response = await getCompanyJobsWithApplicants()
        const filtered = response.data.data.jobs
          .map((job) => ({
            ...job,
            applicants: job.applicants.filter((a) =>
              STATUS_OPTIONS.includes(a.status.toLowerCase() as (typeof STATUS_OPTIONS)[number])
            ),
          }))
          .filter((job) => job.applicants.length > 0)
        setJobs(filtered)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load interviewed students')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const updateStatus = async (applicationId: string, status: string) => {
    try {
      await updateApplicationStatus(applicationId, status)
      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          applicants: job.applicants.map((app) =>
            app.applicationId === applicationId ? { ...app, status } : app
          ),
        }))
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6">Loading interviewed students...</div>
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Interviewed Students</h1>
        <p className="mt-1 text-slate-600">Candidates in shortlisted/selected/rejected stages</p>
      </div>

      <div className="space-y-6 p-6">
        {jobs.length === 0 ? (
          <p className="text-slate-500">No interviewed students found.</p>
        ) : (
          jobs.map((job) => (
            <section key={job.id} className="rounded-xl border border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
              <p className="mb-3 text-sm text-slate-500">{job.applicants.length} candidate(s)</p>

              <div className="space-y-3">
                {job.applicants.map((applicant: Applicant) => (
                  <div key={applicant.applicationId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
                    <div>
                      <p className="font-medium text-slate-900">{applicant.user.name}</p>
                      <p className="text-sm text-slate-500">{applicant.user.email}</p>
                    </div>
                    <select
                      value={applicant.status}
                      onChange={(e) => updateStatus(applicant.applicationId, e.target.value)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
