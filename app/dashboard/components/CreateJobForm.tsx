"use client"
import api from '@/app/api'
import { useState } from 'react'
import type { FormEvent } from 'react'


// Enums matching backend
const JOB_TYPES = ['remote', 'hybrid', 'onsite'] as const
const JOB_CATEGORIES = ['fulltime', 'parttime', 'contract', 'intern'] as const

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

function CreateJobForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [jobType, setJobType] = useState<string>(JOB_TYPES[0])
  const [jobCategory, setJobCategory] = useState<string>(JOB_CATEGORIES[0])
  const [duration, setDuration] = useState('')
  const [lastDateToApply, setLastDateToApply] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCreateJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/jobs/create', {
        title,
        description,
        location,
        salary: Number(salary),
        jobType,
        jobCategory,
        duration,
        lastDateToApply: new Date(lastDateToApply).toISOString(),
      })
      console.log('Create Job response:', response.data)
      setSuccess('Job created successfully!')
      // Reset form
      setTitle('')
      setDescription('')
      setLocation('')
      setSalary('')
      setJobType(JOB_TYPES[0])
      setJobCategory(JOB_CATEGORIES[0])
      setDuration('')
      setLastDateToApply('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message
        : 'Failed to create job'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Create a Job</h2>
      <p className="mt-2 text-slate-600">Fill in the details to post a new job.</p>

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

      <form onSubmit={handleCreateJob} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
            placeholder="Software Engineer"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={inputClass}
            placeholder="Describe the job role, responsibilities, and requirements..."
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className={inputClass}
            placeholder="New York, NY"
          />
        </div>

        <div>
          <label htmlFor="salary" className="mb-1 block text-sm font-medium text-slate-700">
            Salary
          </label>
          <input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            className={inputClass}
            placeholder="50000"
          />
        </div>

        <div>
          <label htmlFor="jobType" className="mb-1 block text-sm font-medium text-slate-700">
            Job Type
          </label>
          <select
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className={inputClass}
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {jobTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="jobCategory" className="mb-1 block text-sm font-medium text-slate-700">
            Job Category
          </label>
          <select
            id="jobCategory"
            value={jobCategory}
            onChange={(e) => setJobCategory(e.target.value)}
            className={inputClass}
          >
            {JOB_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {jobCategoryLabels[category]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="mb-1 block text-sm font-medium text-slate-700">
            Duration
          </label>
          <input
            id="duration"
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className={inputClass}
            placeholder="6 months"
          />
        </div>

        <div>
          <label htmlFor="lastDateToApply" className="mb-1 block text-sm font-medium text-slate-700">
            Last Date to Apply
          </label>
          <input
            id="lastDateToApply"
            type="date"
            value={lastDateToApply}
            onChange={(e) => setLastDateToApply(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateJobForm
