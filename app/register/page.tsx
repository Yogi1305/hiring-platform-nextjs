"use client"

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '../api'

// ─── Password strength helper ─────────────────────────────────────
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  bg: string
} {
  if (!password) return { score: 0, label: '',        color: '',                  bg: ''             }
  if (password.length < 6)
                return { score: 1, label: 'Weak',     color: 'text-red-500',      bg: 'bg-red-400'   }
  const hasUpper   = /[A-Z]/.test(password)
  const hasNumber  = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const extras     = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length
  if (extras === 0) return { score: 2, label: 'Fair',     color: 'text-amber-500',    bg: 'bg-amber-400' }
  if (extras === 1) return { score: 3, label: 'Good',     color: 'text-indigo-600',   bg: 'bg-indigo-500'}
  return              { score: 4, label: 'Strong',   color: 'text-emerald-600',  bg: 'bg-emerald-500'}
}

// ─── Show / hide toggle icon ──────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639
           C3.423 7.51 7.36 4.5 12 4.5
           c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
           C20.577 16.49 16.64 19.5 12 19.5
           c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12
           C3.226 16.338 7.244 19.5 12 19.5
           c.993 0 1.953-.138 2.863-.395
           M6.228 6.228A10.45 10.45 0 0112 4.5
           c4.756 0 8.773 3.162 10.065 7.498
           a10.523 10.523 0 01-4.293 5.774
           M6.228 6.228L3 3m3.228 3.228l3.65 3.65
           m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65
           m0 0a3 3 0 10-4.243-4.243
           m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────
function Field({
  id, label, type = 'text', value, onChange,
  placeholder, required = true,
  suffix,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  suffix?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id}
        className="block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-indigo-500">*</span>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200
                     bg-slate-50 py-2.5 px-4 text-sm text-slate-700
                     placeholder-slate-400 transition-colors
                     focus:border-indigo-400 focus:bg-white
                     focus:outline-none focus:ring-2
                     focus:ring-indigo-100
                     disabled:cursor-not-allowed disabled:opacity-60
                     pr-10"
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3
                          flex items-center">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────
function Register() {
  const router = useRouter()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)

  const strength = getPasswordStrength(password)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/user/create', { name, email, password })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 1200)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50
                    flex items-center justify-center
                    px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">

        {/* ── Brand mark ── */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12
                          items-center justify-center
                          rounded-2xl bg-indigo-600 shadow-sm">
            <svg className="h-6 w-6 text-white" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4
                   m8-4v10l-8 4m0-10L4 7
                   m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-xs font-semibold uppercase
                           tracking-widest text-slate-500">
            HireMe
          </span>
        </div>

        {/* ── Card ── */}
        <div className="rounded-2xl border border-slate-200
                        bg-white p-8 shadow-sm">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight
                           text-slate-900">
              Create account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join HireMe and find your next opportunity today.
            </p>
          </div>

          {/* ── Success banner ── */}
          {success && (
            <div className="mb-6 flex items-center gap-3
                            rounded-xl border border-emerald-200
                            bg-emerald-50 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center
                               justify-center rounded-full
                               bg-emerald-100">
                <svg className="h-4 w-4 text-emerald-600"
                  fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Account created!
                </p>
                <p className="text-xs text-emerald-600">
                  Redirecting you to login…
                </p>
              </div>
            </div>
          )}

          {/* ── Error banner ── */}
          {error && (
            <div className="mb-6 flex items-start gap-3
                            rounded-xl border border-red-100
                            bg-red-50 px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0
                               items-center justify-center
                               rounded-full bg-red-100">
                <svg className="h-3 w-3 text-red-500"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167
                       3.03 0l6.28 10.875c.673 1.167-.17
                       2.625-1.516 2.625H3.72c-1.347
                       0-2.189-1.458-1.515-2.625L8.485
                       2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75
                       0 01-1.5 0v-3.5A.75.75 0 0110 5zm0
                       9a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <Field
              id="name" label="Full Name"
              value={name} onChange={setName}
              placeholder="Jane Doe"
            />

            {/* Email */}
            <Field
              id="email" label="Email Address"
              type="email" value={email} onChange={setEmail}
              placeholder="you@example.com"
            />

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password"
                className="block text-sm font-semibold text-slate-700">
                Password
                <span className="ml-1 text-indigo-500">*</span>
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-slate-200
                             bg-slate-50 py-2.5 px-4 pr-10 text-sm
                             text-slate-700 placeholder-slate-400
                             transition-colors
                             focus:border-indigo-400 focus:bg-white
                             focus:outline-none focus:ring-2
                             focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute inset-y-0 right-3
                             flex items-center text-slate-400
                             hover:text-slate-600 transition-colors"
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="pt-1 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step}
                        className={`h-1 flex-1 rounded-full
                          transition-all duration-300
                          ${strength.score >= step
                            ? strength.bg
                            : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${strength.color}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-slate-100" />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="flex w-full items-center justify-center gap-2
                         rounded-xl bg-indigo-600 px-5 py-2.5
                         text-sm font-semibold text-white shadow-sm
                         transition-colors hover:bg-indigo-700
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500 focus:ring-offset-2
                         disabled:cursor-not-allowed
                         disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0
                         5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login"
              className="font-semibold text-indigo-600
                         hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* ── Below-card note ── */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By creating an account you agree to our{' '}
          <span className="cursor-pointer text-slate-500
                           hover:text-indigo-600 transition-colors">
            Terms of Service
          </span>{' '}
          &amp;{' '}
          <span className="cursor-pointer text-slate-500
                           hover:text-indigo-600 transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register