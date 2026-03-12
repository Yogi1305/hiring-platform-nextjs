"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import api from '../api'
import ApplicationModal from '../components/ApplicationModal'
import JobCard from '../components/JobCard'


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

function Jobs() {
  const navigate = useRouter();
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/jobs/browse')
      // Flatten jobs from companies
      const companies = response.data.data
      const allJobs: Job[] = []
      for (const company of companies) {
        for (const job of company.jobs || []) {
          allJobs.push({
            ...job,
            company: {
              id: company.id,
              companyName: company.companyName,
              location: company.location,
              industry: company.industry,
              website: company.website,
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

  const handleApply = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <span className="ml-3 text-slate-600">Loading jobs...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchJobs}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Available Jobs</h1>
          <p className="mt-2 text-slate-600">Find your next opportunity and apply today</p>
        </div>
        <button
          onClick={() => navigate.push('/applied-jobs')}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          My Applications
        </button>
      </div>

      {/* {jobs.filter((job) => job.isPublic).length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">No public jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs
            .filter((job) => job.isPublic)
            .map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
        </div>
      )} */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs
            // .filter((job) => job.isPublic)
            .map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
        </div>

      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </main>
  )
}

export default Jobs
