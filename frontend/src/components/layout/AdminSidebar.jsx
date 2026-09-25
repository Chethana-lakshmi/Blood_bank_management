import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Droplets, LayoutDashboard, Users, UserCheck, Building2, Droplet, Heart, ClipboardList, Bell, BarChart2, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/donors', icon: UserCheck, label: 'Donors' },
  { to: '/admin/hospitals', icon: Building2, label: 'Hospitals' },
  { to: '/admin/blood-stock', icon: Droplet, label: 'Blood Stock' },
  { to: '/admin/donations', icon: Heart, label: 'Donations' },
  { to: '/admin/requests', icon: ClipboardList, label: 'Requests' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
]

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-100 ${collapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="font-bold text-gray-900 text-base">BloodConnect</span>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm group ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } ${collapsed && !isMobile ? 'justify-center' : ''}`
              }
              title={collapsed && !isMobile ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {(!collapsed || isMobile) && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User info + logout */}
      <div className={`p-3 border-t border-gray-100 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        {(!collapsed || isMobile) ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-700 font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent isMobile />
      </aside>
    </>
  )
}
