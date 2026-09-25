import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <LoadingSpinner text="Loading..." fullPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardMap = {
      admin: '/admin/dashboard',
      donor: '/donor/dashboard',
      hospital: '/hospital/dashboard',
    }
    return <Navigate to={dashboardMap[user.role] || '/'} replace />
  }

  return <Outlet />
}
