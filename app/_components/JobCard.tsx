import type { Job } from '../_pages/Jobs'

interface JobCardProps {
  job: Job
  onApply: (job: Job) => void
}

function JobCard({ job, onApply }: JobCardProps) {
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

  const getJobTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'remote':
        return 'bg-green-100 text-green-700'
      case 'onsite':
        return 'bg-blue-100 text-blue-700'
      case 'hybrid':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'fulltime':
        return 'bg-indigo-100 text-indigo-700'
      case 'parttime':
        return 'bg-amber-100 text-amber-700'
      case 'internship':
        return 'bg-cyan-100 text-cyan-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const isDeadlinePassed = job.lastDateToApply ? new Date(job.lastDateToApply) < new Date() : false

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
          {job.jobType || 'N/A'}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(job.jobCategory)}`}>
          {job.jobCategory || 'N/A'}
        </span>
      </div>

      <h3 className="mb-1 text-xl font-semibold text-slate-900 group-hover:text-indigo-600">
        {job.title || 'Untitled Job'}
      </h3>

      {job.company?.companyName && (
        <p className="mb-3 text-sm font-medium text-indigo-600">{job.company.companyName}</p>
      )}
      
      <p className="mb-4 line-clamp-2 text-sm text-slate-600">{job.description || 'No description'}</p>

      <div className="mb-4 space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{job.salary ? `${formatSalary(job.salary)}/month` : 'Salary not disclosed'}</span>
        </div>
        {job.duration && (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{job.duration} months</span>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>{job.lastDateToApply ? `Apply by: ${formatDate(job.lastDateToApply)}` : 'Open'}</span>
          {job.test && (
            <span className="rounded bg-orange-100 px-2 py-0.5 text-orange-700">
              Has Test
            </span>
          )}
        </div>
        <button
          onClick={() => onApply(job)}
          disabled={isDeadlinePassed}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isDeadlinePassed
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isDeadlinePassed ? 'Application Closed' : 'Apply Now'}
        </button>
      </div>
    </div>
  )
}

export default JobCard
