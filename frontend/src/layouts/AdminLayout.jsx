import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminSidebar from '../components/layout/AdminSidebar'
import NotificationBell from '../components/ui/NotificationBell'

export default function AdminLayout() {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900 hidden sm:block">Admin Panel</p>
              <p className="text-xs text-gray-400 hidden sm:block">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-700 font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
