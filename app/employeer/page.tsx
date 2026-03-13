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
  const [showCompanyPassword, setShowCompanyPassword] = useState(false)
  const [showEmployeePassword, setShowEmployeePassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

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
      const message = err instanceof Error ? err.message : 'Company registration failed'
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
      const message = err instanceof Error ? err.message : 'Employee registration failed'
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
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100'

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'company-register',
      label: 'Company',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'employee-register',
      label: 'Employee',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'login',
      label: 'Login',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ]

  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {show ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Employer Portal
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Get Started
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register your company, add employees, or sign in to your account
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-lg">

          {/* Tab Navigation */}
          <div className="mb-0 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key)
                    setError(null)
                    setSuccess(null)
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Alert Messages */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                  <svg className="h-3 w-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 mt-0.5">
                  <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-emerald-700">{success}</p>
              </div>
            )}

            {/* ── Company Register Form ── */}
            {activeTab === 'company-register' && (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Register Company</h2>
                    <p className="text-xs text-slate-500">Create your company account</p>
                  </div>
                </div>

                <form onSubmit={handleCompanyRegister} className="space-y-4">
                  {/* Two column grid for some fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="companyName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Company Name <span className="text-red-400">*</span>
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

                    <div className="sm:col-span-2">
                      <label htmlFor="companyEmail" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          id="companyEmail"
                          type="email"
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="contact@company.com"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="companyPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="companyPassword"
                          type={showCompanyPassword ? 'text' : 'password'}
                          value={companyPassword}
                          onChange={(e) => setCompanyPassword(e.target.value)}
                          required
                          className={`${inputClass} pr-10`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCompanyPassword(!showCompanyPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <EyeIcon show={showCompanyPassword} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          id="location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="industry" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Industry <span className="text-red-400">*</span>
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
                      <label htmlFor="website" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Website
                        <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-normal normal-case text-slate-400">optional</span>
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
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Phone
                        <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-normal normal-case text-slate-400">optional</span>
                      </label>
                      <div className="relative">
                        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`${inputClass} pl-10`}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Registering…
                      </span>
                    ) : 'Register Company'}
                  </button>
                </form>
              </>
            )}

            {/* ── Employee Register Form ── */}
            {activeTab === 'employee-register' && (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Register Employee</h2>
                    <p className="text-xs text-slate-500">Join your company using the company code</p>
                  </div>
                </div>

                <form onSubmit={handleEmployeeRegister} className="space-y-4">
                  <div>
                    <label htmlFor="employeeName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        id="employeeName"
                        type="text"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="employeeEmail" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        id="employeeEmail"
                        type="email"
                        value={employeeEmail}
                        onChange={(e) => setEmployeeEmail(e.target.value)}
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="employeePhone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        id="employeePhone"
                        type="tel"
                        value={employeePhone}
                        onChange={(e) => setEmployeePhone(e.target.value)}
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="employeePassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="employeePassword"
                        type={showEmployeePassword ? 'text' : 'password'}
                        value={employeePassword}
                        onChange={(e) => setEmployeePassword(e.target.value)}
                        required
                        className={`${inputClass} pr-10`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <EyeIcon show={showEmployeePassword} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyCode" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Company Code <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <input
                        id="companyCode"
                        type="text"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                        required
                        maxLength={6}
                        className={`${inputClass} pl-10 font-mono tracking-widest`}
                        placeholder="ABC123"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">Enter the 6-character code provided by your company</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Registering…
                      </span>
                    ) : 'Register Employee'}
                  </button>
                </form>
              </>
            )}

            {/* ── Login Form ── */}
            {activeTab === 'login' && (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-xs text-slate-500">Sign in to your employer account</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Login Type Toggle */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Login as
                    </label>
                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => setLoginType('company')}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                          loginType === 'company'
                            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Company
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginType('employee')}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                          loginType === 'employee'
                            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Employee
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="loginEmail" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        id="loginEmail"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="loginPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="loginPassword"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className={`${inputClass} pr-10`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <EyeIcon show={showLoginPassword} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer note */}
          <p className="mt-5 text-center text-xs text-slate-400">
            By continuing, you agree to our{' '}
            <span className="cursor-pointer text-indigo-500 hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="cursor-pointer text-indigo-500 hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Employeer