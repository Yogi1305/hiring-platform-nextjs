import Link from 'next/link';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/create-job', label: 'Create Job' },
  { href: '/dashboard/applied-students', label: 'Applied Students' },
  { href: '/dashboard/interviewed-students', label: 'Interviewed Students' },
  { href: '/dashboard/employees', label: 'Employees' },
  { href: '/dashboard/questionbank', label: 'Question Bank' },
];

function Dashboard() {
  const linkClass = (isActive: boolean) =>
    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4">
        <h2 className="mb-4 px-4 text-lg font-bold text-slate-900">Menu</h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p>Select an option from the menu to get started.</p>
      </main>
    </div>
  );
}

export default Dashboard;
