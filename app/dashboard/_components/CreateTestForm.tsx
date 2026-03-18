"use client"
import api from '@/app/api'
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

interface Job {
  id: string
  title: string
  jobType: string
  jobCategory: string
  location: string
  salary: number
  duration: string
  lastDateToApply: string
}

// Display labels for enums
const jobTypeLabels: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}
const jobCategoryLabels: Record<string, string> = {
  fulltime: 'Full Time',
  parttime: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring'

function CreateTestForm() {
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Form state
  const [testTitle, setTestTitle] = useState('')
  const [testDescription, setTestDescription] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/all')
        setJobs(response.data.data || [])
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
        setError('Failed to load jobs')
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchJobs()
  }, [])

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job)
    setTestTitle('')
    setTestDescription('')
    setError(null)
    setSuccess(null)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
    setTestTitle('')
    setTestDescription('')
    setError(null)
    setSuccess(null)
  }

  const handleCreateTest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedJob) {
      setError('No job selected')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/tests/create', {
        title: testTitle,
        description: testDescription,
        jobId: selectedJob.id,
      })
      console.log('Create Test response:', response.data)
      setSuccess('Test created successfully!')
      // Reset form
      setTestTitle('')
      setTestDescription('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create test'
       
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loadingJobs) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading jobs...</div>
      </div>
    )
  }

  // Show job list if no job selected
  if (!selectedJob) {
    return (
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Test</h2>
        <p className="mt-2 text-slate-600">Select a job to create a test for applicants.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-500">No jobs found. Create a job first.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{job.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {jobTypeLabels[job.jobType] || job.jobType}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {jobCategoryLabels[job.jobCategory] || job.jobCategory}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectJob(job)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Add Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Show form for selected job
  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleBackToJobs}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Test</h2>
          <p className="mt-1 text-slate-600">
            Creating test for: <span className="font-medium text-indigo-600">{selectedJob.title}</span>
          </p>
        </div>
      </div>

      {/* Selected Job Info */}
      <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">{selectedJob.title}</p>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {jobTypeLabels[selectedJob.jobType] || selectedJob.jobType}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {jobCategoryLabels[selectedJob.jobCategory] || selectedJob.jobCategory}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>Job ID:</p>
            <p className="font-mono text-xs text-slate-700">{selectedJob.id}</p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleCreateTest} className="mt-6 space-y-4">
        <div>
          <label htmlFor="testTitle" className="mb-1 block text-sm font-medium text-slate-700">
            Test Title
          </label>
          <input
            id="testTitle"
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            required
            className={inputClass}
            placeholder="Technical Assessment"
          />
        </div>

        <div>
          <label htmlFor="testDescription" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="testDescription"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            required
            rows={3}
            className={inputClass}
            placeholder="Describe the purpose and instructions for this test..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Test'}
        </button>
      </form>
    </div>
  )
}

export default CreateTestForm
