import { Applicant, getCompanyJobsWithApplicants, JobWithApplicants, updateApplicationStatus } from '@/app/api'
import { useState, useEffect } from 'react'


// Status options available in Applied Students section
const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted']

function AppliedStudents() {
  const [jobs, setJobs] = useState<JobWithApplicants[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobWithApplicants | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await getCompanyJobsWithApplicants()
      setJobs(response.data.data.jobs)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'reviewed':
        return 'bg-purple-100 text-purple-700'
      case 'shortlisted':
        return 'bg-indigo-100 text-indigo-700'
      case 'interview':
        return 'bg-blue-100 text-blue-700'
      case 'accepted':
      case 'hired':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId)
    try {
      await updateApplicationStatus(applicationId, newStatus)
      // Update local state
      if (selectedJob) {
        const updatedApplicants = selectedJob.applicants.map((app) =>
          app.applicationId === applicationId ? { ...app, status: newStatus } : app
        )
        setSelectedJob({ ...selectedJob, applicants: updatedApplicants })
        // Also update in jobs array
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === selectedJob.id ? { ...job, applicants: updatedApplicants } : job
          )
        )
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  // Show applicants for selected job
  if (selectedJob) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <button
            onClick={() => setSelectedJob(null)}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{selectedJob.title}</h1>
          <p className="mt-1 text-slate-600">{selectedJob.applicantCount} applicant(s)</p>
        </div>

        <div className="p-6">
          {selectedJob.applicants.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No applicants yet</p>
          ) : (
            <div className="space-y-4">
              {selectedJob.applicants.map((applicant: Applicant) => (
                <div
                  key={applicant.applicationId}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                          {applicant.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{applicant.user.name}</h3>
                          <p className="text-sm text-slate-500">{applicant.user.email}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      {applicant.user.profile?.skills && applicant.user.profile.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {applicant.user.profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700"
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
                            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
                            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right side info */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="relative">
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant.applicationId, e.target.value)}
                          disabled={updatingStatus === applicant.applicationId}
                          className={`cursor-pointer appearance-none rounded-full py-1 pl-3 pr-8 text-xs font-medium capitalize outline-none ${getStatusColor(applicant.status)} ${updatingStatus === applicant.applicationId ? 'opacity-50' : ''}`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          Score: {applicant.testScore}
                        </p>
                        <p className="text-xs text-slate-500">
                          {applicant.correctAnswers} correct, {applicant.incorrectAnswers} incorrect
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        Applied {formatDate(applicant.appliedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show jobs list
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applied Students</h1>
        <p className="mt-1 text-slate-600">Select a job to view applicants</p>
      </div>

      <div className="p-6">
        {jobs.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No jobs found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                    {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{job.title}</h3>
                <p className="mt-1 text-sm text-indigo-600">View applicants →</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppliedStudents
