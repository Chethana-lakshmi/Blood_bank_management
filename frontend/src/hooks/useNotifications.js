import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Add 'export' back to the function definition (Named export)
export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/notifications')
      const rawList = res.data?.data?.notifications || res.data?.notifications || (Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []))
      const data = Array.isArray(rawList) ? rawList : []
      setNotifications(data)
      const unread = res.data?.data?.unreadCount ?? res.data?.unreadCount ?? data.filter(n => !n.read && !n.isRead).length
      setCount(unread)
    } catch (err) {
      // silently fail for background fetches
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications/unread-count')
      const unreadCount = res.data?.data?.unreadCount ?? res.data?.unreadCount ?? res.data?.count ?? 0
      setCount(unreadCount)
    } catch (err) {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, fetchUnreadCount])

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true, read: true } : n)
      )
      setCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })))
      setCount(0)
    } catch (err) {
      console.error('Failed to mark all notifications as read', err)
    }
  }, [])

  return { count, notifications, markAsRead, markAllRead, loading, refetch: fetchNotifications }
}

// Add this line at the bottom (Default export)
export default useNotifications