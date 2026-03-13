'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'


import api from '../api'
import { useRouter } from 'next/navigation'

type Tab = 'company-register' | 'employee-register' | 'login'
type LoginType = 'company' | 'employee'

function Employeer() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('company-register')

  // Company Register state
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPassword, setCompanyPassword] = useState('')
  const [location, setLocation] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')

  // Employee Register state
  const [employeeName, setEmployeeName] = useState('')
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [employeePhone, setEmployeePhone] = useState('')
  const [employeePassword, setEmployeePassword] = useState('')
  const [companyCode, setCompanyCode] = useState('')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginType, setLoginType] = useState<LoginType>('company')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCompanyRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/companyowner/create', {
        companyName,
        email: companyEmail,
        password: companyPassword,
        location,
        industry,
        website: website || null,
        phone: phone || null,
      })
      console.log('Company Register response:', response.data)
      setSuccess('Company registered successfully!')
    } catch (err: unknown) {
      const message =err instanceof Error ? err.message : 'Company registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
       
  }

  const handleEmployeeRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/employees/create', {
        name: employeeName,
        email: employeeEmail,
        phone: employeePhone,
        password: employeePassword,
        companyCode,
      })
      console.log('Employee Register response:', response.data)
      setSuccess('Employee registered successfully!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message :
        'Employee registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const endpoint = loginType === 'company' ? '/companyowner/login' : '/employees/login'

    try {
      const response = await api.post(endpoint, {
        email: loginEmail,
        password: loginPassword,
      })
      console.log('Login response:', response.data)
      setSuccess('Login successful!')
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message :
       'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const tabClass = (tab: Tab) =>
    `rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    }`

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring'

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-lg">
        {/* Tabs */}
        <div className="flex gap-1">
          <button type="button" className={tabClass('company-register')} onClick={() => setActiveTab('company-register')}>
            Company Register
          </button>
          <button type="button" className={tabClass('employee-register')} onClick={() => setActiveTab('employee-register')}>
            Employee Register
          </button>
          <button type="button" className={tabClass('login')} onClick={() => setActiveTab('login')}>
            Login
          </button>
        </div>

        {/* Forms */}
        <div className="rounded-b-2xl rounded-tr-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}
          {/* Company Register Form */}
          {activeTab === 'company-register' && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Register Company</h2>
              <p className="mt-2 text-sm text-slate-600">Create an account as a company owner.</p>

              <form onSubmit={handleCompanyRegister} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="companyName" className="mb-1 block text-sm font-medium text-slate-700">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label htmlFor="companyEmail" className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="companyEmail"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="contact@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="companyPassword" className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="companyPassword"
                    type="password"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="••••••••"
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
                  <label htmlFor="industry" className="mb-1 block text-sm font-medium text-slate-700">
                    Industry
                  </label>
                  <input
                    id="industry"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Technology"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="mb-1 block text-sm font-medium text-slate-700">
                    Website <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={inputClass}
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                    Phone <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register Company'}
                </button>
              </form>
            </>
          )}

          {/* Employee Register Form */}
          {activeTab === 'employee-register' && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Register Employee</h2>
              <p className="mt-2 text-sm text-slate-600">Join your company using the company code.</p>

              <form onSubmit={handleEmployeeRegister} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="employeeName" className="mb-1 block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    id="employeeName"
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="employeeEmail" className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="employeeEmail"
                    type="email"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="employeePhone" className="mb-1 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    id="employeePhone"
                    type="tel"
                    value={employeePhone}
                    onChange={(e) => setEmployeePhone(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label htmlFor="employeePassword" className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="employeePassword"
                    type="password"
                    value={employeePassword}
                    onChange={(e) => setEmployeePassword(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="companyCode" className="mb-1 block text-sm font-medium text-slate-700">
                    Company Code
                  </label>
                  <input
                    id="companyCode"
                    type="text"
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                    required
                    maxLength={6}
                    className={inputClass}
                    placeholder="ABC123"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register Employee'}
                </button>
              </form>
            </>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Employeer Login</h2>
              <p className="mt-2 text-sm text-slate-600">Sign in as company owner or employee.</p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Login as</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginType('company')}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${loginType === 'company' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Company Owner
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('employee')}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${loginType === 'employee' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Employee
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="loginEmail" className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="loginPassword" className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default Employeer
