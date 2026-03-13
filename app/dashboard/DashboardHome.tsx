
import { useEffect, useState } from 'react';
import { fetchAllJobs, toggleJobPublic } from '../api';
import type { Job } from '../jobs/page.tsx';

function DashboardHome() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async (jobId: string) => {
    setTogglingId(jobId);
    try {
      await toggleJobPublic(jobId);
      await fetchJobs();
    } catch (err) {
      alert('Failed to update job public/private status.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Manage Jobs</h1>
      {loading ? (
        <div className="text-slate-600">Loading jobs...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-slate-500">No jobs found.</div>
      ) : (
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Salary</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Public</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-2 font-medium text-slate-900">{job.title}</td>
                <td className="px-4 py-2 text-slate-700">{job.location}</td>
                <td className="px-4 py-2 text-slate-700">{job.salary}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${job.isPublic ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {job.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className={`rounded px-3 py-1 text-xs font-medium ${job.isPublic ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-green-500 text-white hover:bg-green-600'} transition-colors`}
                    onClick={() => handleTogglePublic(job.id)}
                    disabled={togglingId === job.id}
                  >
                    {togglingId === job.id
                      ? 'Updating...'
                      : job.isPublic
                        ? 'Make Private'
                        : 'Make Public'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DashboardHome
