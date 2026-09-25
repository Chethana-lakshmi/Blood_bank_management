import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Droplet, Bell, User } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

const navItems = [
  { to: '/donor/dashboard', icon: Home, label: 'Home' },
  { to: '/donor/donations', icon: Droplet, label: 'Donations' },
  { to: '/donor/notifications', icon: Bell, label: 'Alerts', hasCount: true },
  { to: '/donor/profile', icon: User, label: 'Profile' },
]

export default function DonorBottomNav() {
  const { count } = useNotifications()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-[60px] pb-safe px-2">
        {navItems.map(({ to, icon: Icon, label, hasCount }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                  {hasCount && count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
