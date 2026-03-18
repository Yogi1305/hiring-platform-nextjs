import Link from 'next/link'

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero Section ──────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">

            {/* Live badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Now Hiring
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Your Next{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-indigo-600">Dream Job</span>
                <span className="absolute -bottom-1 left-0 z-0 h-3 w-full rounded-full bg-indigo-100" />
              </span>{' '}
              Today
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              HireMe connects job seekers and employers in one place. Browse jobs,
              apply quickly, and get hired faster than ever before.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Jobs
              </Link>
              <Link
                href="/employer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* ── Stats Row ──────────────────────────────────────── */}
        <div className="mb-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { value: '10K+', label: 'Active Jobs',   color: 'text-indigo-600',  bg: 'bg-indigo-50',  ring: 'ring-indigo-100'  },
            { value: '5K+',  label: 'Companies',     color: 'text-violet-600',  bg: 'bg-violet-50',  ring: 'ring-violet-100'  },
            { value: '50K+', label: 'Job Seekers',   color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
            { value: '95%',  label: 'Success Rate',  color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-100'   },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ring-1 ${stat.ring}`}>
                <span className={`text-sm font-black ${stat.color}`}>#</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── How It Works ───────────────────────────────────── */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              How It Works
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Get hired in 3 simple steps
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Our streamlined process makes finding and applying for jobs effortless
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and build a professional profile showcasing your skills, experience, and education.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', iconRing: 'ring-indigo-100', stepColor: 'text-indigo-100',
              },
              {
                step: '02',
                title: 'Browse & Apply',
                description: 'Explore thousands of job listings, filter by category, and apply with just a few clicks.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                iconBg: 'bg-violet-50', iconColor: 'text-violet-600', iconRing: 'ring-violet-100', stepColor: 'text-violet-100',
              },
              {
                step: '03',
                title: 'Get Hired',
                description: 'Connect directly with employers, ace your interviews, and land your dream job faster.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', iconRing: 'ring-emerald-100', stepColor: 'text-emerald-100',
              },
            ].map((item, index, arr) => (
              <div
                key={item.step}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* Watermark step number */}
                <span className={`absolute -right-2 -top-3 select-none text-7xl font-black ${item.stepColor}`}>
                  {item.step}
                </span>

                <div className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} ring-1 ${item.iconRing}`}>
                  {item.icon}
                </div>

                {/* Connector arrow */}
                {index < arr.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                      <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <h3 className="relative font-bold text-slate-800">{item.title}</h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── For Job Seekers & Employers ────────────────────── */}
        <div className="mb-16 grid gap-5 md:grid-cols-2">

          {/* Job Seekers */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">For Job Seekers</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Discover thousands of opportunities, build your profile, and apply to your dream
              companies with ease.
            </p>
            <ul className="mt-4 space-y-2">
              {['Browse curated job listings', 'One-click applications', 'Track your applications', 'Build a standout profile'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                    <svg className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started Free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Employers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 shadow-sm">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">For Employers</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Post jobs, review applications, and connect with top talent to grow your team
              quickly and efficiently.
            </p>
            <ul className="mt-4 space-y-2">
              {['Post unlimited job listings', 'Custom application forms', 'Built-in screening tests', 'Manage employee access'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/employer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Register Your Company
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── CTA Banner ─────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
          <div className="relative px-8 py-12 text-center sm:px-16">
            {/* Decorative blobs */}
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <span className="relative inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready to start?
            </span>
            <h2 className="relative mt-4 text-2xl font-bold text-white sm:text-3xl">
              Your next opportunity is waiting
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-200">
              Join thousands of professionals who found their dream jobs through HireMe.
              It's free to get started.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Browse All Jobs
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home