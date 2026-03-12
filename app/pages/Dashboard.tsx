import { NavLink, Outlet } from 'react-router-dom'

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/create-job', label: 'Create Job' },
  { to: '/dashboard/applied-students', label: 'Applied Students' },
  { to: '/dashboard/interviewed-students', label: 'Interviewed Students' },
  { to: '/dashboard/employees', label: 'Employees' },
  { to: '/dashboard/questionbank', label: 'Question Bank' },
]

function Dashboard() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4">
        <h2 className="mb-4 px-4 text-lg font-bold text-slate-900">Menu</h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard
