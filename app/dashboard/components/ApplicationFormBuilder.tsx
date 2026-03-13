"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api, { createForm } from '@/app/api';

// Form field types
const FIELD_TYPES = ['text', 'email', 'number', 'tel', 'textarea', 'select', 'checkbox', 'date'] as const;
type FieldType = typeof FIELD_TYPES[number];

interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  options?: string[] // for select fields
}

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

function ApplicationFormBuilder() {
  const router = useRouter();

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Form builder state
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<FieldType>('text')
  const [newFieldRequired, setNewFieldRequired] = useState(false)
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('')
  const [newFieldOptions, setNewFieldOptions] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs/all'); // Correctly destructure the `data` property
        setJobs(data.data || []); 
        // console.log(data)// Ensure `data` is an array
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const addFormField = () => {
    if (!newFieldLabel.trim()) return

    const newField: FormField = {
      id: crypto.randomUUID(),
      label: newFieldLabel,
      type: newFieldType,
      required: newFieldRequired,
      placeholder: newFieldPlaceholder || undefined,
      options: newFieldType === 'select' ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean) : undefined,
    }

    setFormFields([...formFields, newField])
    // Reset
    setNewFieldLabel('')
    setNewFieldType('text')
    setNewFieldRequired(false)
    setNewFieldPlaceholder('')
    setNewFieldOptions('')
  }

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id))
  }

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job)
    setFormFields([])
    setError(null)
    setSuccess(null)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
    setFormFields([])
    setError(null)
    setSuccess(null)
  }

  const handleSaveApplicationForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formFields.length === 0) {
      setError('Please add at least one field to the application form')
      return
    }
    if (!selectedJob) {
      setError('No job selected')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await createForm(selectedJob.id, formFields)
      
      console.log('Save Form response:', response);
      setSuccess('Application form saved successfully!');
      setFormFields([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save application form');
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
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Application Form Builder</h2>
        <p className="mt-2 text-slate-600">Select a job to create a custom application form.</p>

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
                  Create Form
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Show form builder for selected job
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
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Application Form Builder</h2>
          <p className="mt-1 text-slate-600">
            Creating form for: <span className="font-medium text-indigo-600">{selectedJob.title}</span>
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

      {/* Add Field Section */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Add New Field</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Label</label>
            <input
              type="text"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              className={inputClass}
              placeholder="Field label"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as FieldType)}
              className={inputClass}
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Placeholder</label>
            <input
              type="text"
              value={newFieldPlaceholder}
              onChange={(e) => setNewFieldPlaceholder(e.target.value)}
              className={inputClass}
              placeholder="Optional placeholder"
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={newFieldRequired}
                onChange={(e) => setNewFieldRequired(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              Required
            </label>
          </div>
        </div>

        {newFieldType === 'select' && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Options (comma-separated)
            </label>
            <input
              type="text"
              value={newFieldOptions}
              onChange={(e) => setNewFieldOptions(e.target.value)}
              className={inputClass}
              placeholder="Option 1, Option 2, Option 3"
            />
          </div>
        )}

        <button
          type="button"
          onClick={addFormField}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Field
        </button>
      </div>

      {/* Form Fields Preview */}
      {formFields.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Form Fields ({formFields.length})</h3>
          <div className="mt-4 space-y-3">
            {formFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{field.label}</p>
                    <p className="text-sm text-slate-500">
                      Type: {field.type} {field.required && '• Required'}
                      {field.options && ` • Options: ${field.options.join(', ')}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFormField(field.id)}
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Form */}
      <form onSubmit={handleSaveApplicationForm} className="mt-6 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={loading || formFields.length === 0}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Application Form'}
        </button>
      </form>
    </div>
  )
}

export default ApplicationFormBuilder
