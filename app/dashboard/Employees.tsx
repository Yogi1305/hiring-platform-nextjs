"use client"

import { useState, useEffect } from 'react'
import { getCompanyEmployees } from '../api'
import type { Employee } from '../api'

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await getCompanyEmployees()
      setEmployees(response.data.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load employees')
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

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-700'
      case 'hr':
        return 'bg-blue-100 text-blue-700'
      case 'interviewer':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-slate-100 text-slate-700'
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employees</h1>
        <p className="mt-1 text-slate-600">{employees.length} team member{employees.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="p-6">
        {employees.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No employees found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm font-medium text-slate-500">
                  <th className="pb-3 pr-4">Employee</th>
                  <th className="pb-3 pr-4">Phone</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Company Code</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((employee) => (
                  <tr key={employee.id} className="text-sm">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.name}</p>
                          <p className="text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{employee.phone || '—'}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getRoleBadgeColor(employee.role)}`}
                      >
                        {employee.role}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <code className="rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">
                        {employee.companyCode}
                      </code>
                    </td>
                    <td className="py-4 text-slate-500">{formatDate(employee.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Employees
