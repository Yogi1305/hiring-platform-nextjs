"use client"
import { useEffect, useState } from 'react'
import { getUserApplications, type UserApplication } from '../api'

function AppliedJobs() {
  const [applications, setApplications] = useState<UserApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getUserApplications()
        setApplications(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load applications')
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(salary)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'shortlisted':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'hired':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'interviewed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getJobTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'remote':
        return 'bg-green-100 text-green-700'
      case 'onsite':
        return 'bg-blue-100 text-blue-700'
      case 'hybrid':
        return 'bg-purple-100 text-purple-700'
      case 'fulltime':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-600">Loading your applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
          <p className="mt-2 text-slate-600">Track the status of your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No applications yet</h3>
            <p className="mt-2 text-slate-500">Start applying to jobs to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getJobTypeColor(application.job.jobType)}`}>
                        {application.job.jobType}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900">
                      {application.job.title}
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                      {application.job.company.logo && (
                        <img
                          src={application.job.company.logo}
                          alt={application.job.company.name}
                          className="h-5 w-5 rounded object-cover"
                        />
                      )}
                      <span className="text-sm font-medium text-indigo-600">
                        {application.job.company.name}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {application.job.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{application.job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatSalary(application.job.salary)}/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Apply by: {formatDate(application.job.lastDateToApply)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Results & Dates */}
                  <div className="flex flex-col gap-3 lg:items-end">
                    {application.testAnswered && application.totalquestions > 0 && (
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">Test Score</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            {application.correctedanswers.length}/{application.totalquestions}
                          </span>
                          <span className={`text-xs font-medium ${
                            (application.correctedanswers.length / application.totalquestions) >= 0.7
                              ? 'text-green-600'
                              : (application.correctedanswers.length / application.totalquestions) >= 0.4
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            ({Math.round((application.correctedanswers.length / application.totalquestions) * 100)}%)
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-24 rounded-full bg-slate-200">
                          <div
                            className={`h-1.5 rounded-full ${
                              (application.correctedanswers.length / application.totalquestions) >= 0.7
                                ? 'bg-green-500'
                                : (application.correctedanswers.length / application.totalquestions) >= 0.4
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(application.correctedanswers.length / application.totalquestions) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {!application.testAnswered && (
                      <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs text-slate-500">No test required</span>
                      </div>
                    )}

                    <div className="text-right text-xs text-slate-400">
                      <p>Applied: {formatDate(application.createdAt)}</p>
                      {application.updatedAt !== application.createdAt && (
                        <p>Updated: {formatDate(application.updatedAt)}</p>
                      )}
                    </div>
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

export default AppliedJobs
