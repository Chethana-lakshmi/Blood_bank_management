import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load token and validate on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      validateToken(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (savedToken) => {
    try {
      const res = await api.get('/auth/me')
      const payload = res.data?.data || res.data
      setUser(payload.user || payload)
      setIsAuthenticated(true)
    } catch (err) {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const payload = res.data?.data || res.data
    const newToken = payload.token || res.data.token
    const newUser = payload.user || res.data.user
    localStorage.setItem('token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
    return newUser
  }, [])

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data)
    const payload = res.data?.data || res.data
    const newToken = payload.token || res.data.token
    const newUser = payload.user || res.data.user
    localStorage.setItem('token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
