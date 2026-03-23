import Link from "next/link";

export default function NotFound() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-32 -top-40 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-40 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
			</div>

			<section className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-12">
				<p className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
					Error 404
				</p>

				<h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
					Page Not Found
				</h1>

				<p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
					The page you are looking for does not exist or may have moved. You can return to the
					homepage or continue browsing current job opportunities.
				</p>

				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
					>
						Go To Home
					</Link>
					<Link
						href="/jobs"
						className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-950"
					>
						Explore Jobs
					</Link>
				</div>

				<p className="mt-6 text-sm text-slate-400">
					Need help? Visit the dashboard after login or use the navigation bar to find your way.
				</p>
			</section>
		</main>
	);
}
