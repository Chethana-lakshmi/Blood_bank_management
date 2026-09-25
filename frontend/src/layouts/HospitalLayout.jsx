import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Droplets, Home, Search, ClipboardList, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NotificationBell from '../components/ui/NotificationBell'
import HospitalBottomNav from '../components/layout/HospitalBottomNav'

const sidebarItems = [
  { to: '/hospital/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/hospital/search-blood', icon: Search, label: 'Search Blood' },
  { to: '/hospital/requests', icon: ClipboardList, label: 'Requests' },
  { to: '/hospital/notifications', icon: Bell, label: 'Notifications' },
  { to: '/hospital/profile', icon: User, label: 'Profile' },
]

export default function HospitalLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">BloodConnect</span>
        </div>

        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'H'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">Hospital</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">BloodConnect</span>
          </div>
          <NotificationBell />
        </header>

        <header className="hidden md:flex sticky top-0 z-20 bg-white border-b border-gray-100 h-14 items-center justify-between px-6">
          <h1 className="text-sm font-medium text-gray-500">
            Welcome, <span className="text-gray-900 font-semibold">{user?.name}</span>
          </h1>
          <NotificationBell />
        </header>

        <main className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      <HospitalBottomNav />
    </div>
  )
}
