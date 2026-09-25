import React, { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { formatDistanceToNow } from '../../utils/dateUtils'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { count, notifications, markAsRead, markAllRead, loading } = useNotifications()

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifsList = Array.isArray(notifications) ? notifications : (Array.isArray(notifications?.notifications) ? notifications.notifications : [])
  const recent = notifsList.slice(0, 6)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {recent.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No notifications yet
              </div>
            ) : (
              recent.map((n) => (
                <div
                  key={n._id}
                  className={[
                    'flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors',
                    !n.isRead && !n.read ? 'bg-red-50' : '',
                  ].join(' ')}
                  onClick={() => {
                    if (!n.isRead && !n.read) markAsRead(n._id)
                  }}
                >
                  <div className={[
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm',
                    !n.isRead && !n.read ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500',
                  ].join(' ')}>
                    🔔
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!n.isRead && !n.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDistanceToNow(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && !n.read && (
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
