function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          HireMe
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          How HireMe Works
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        HireMe connects job seekers and employers in one place. Browse jobs, apply quickly,
        and get hired faster.
        </p>
      </div>
    </main>
  )
}

export default Home
