"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { name: 'Dashboard Home', path: '/dashboard' },
  { name: 'Applied Students', path: '/dashboard/applied-students' },
  { name: 'Create Job', path: '/dashboard/create-job' },
  { name: 'Employees', path: '/dashboard/employees' },
  { name: 'Interviewed Students', path: '/dashboard/interviewed-students' },
  { name: 'Question Bank', path: '/dashboard/questionbank' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState(pathname);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold">Dashboard</div>
        <nav className="flex-1">
          <ul>
            {pages.map((page) => (
              <li key={page.path}>
                <Link href={page.path} legacyBehavior>
                  <a
                    className={`block px-4 py-2 hover:bg-gray-700 transition-colors ${
                      activePage === page.path ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => setActivePage(page.path)}
                  >
                    {page.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</div>
    </div>
  );
}