import axios from 'axios'

const getBaseUrl = () => {
  // 1. If explicit environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  }

  // 2. If running locally in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api'
    }
  }

  // 3. Fallback for deployed production environments (Vercel)
  return 'https://blood-bank-management-v3gc.onrender.com/api'
}

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  withCredentials: true,
})

// Attach Authorization Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle response errors gracefully without interrupting login/register forms
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute =
      err.config?.url?.includes('/auth/login') ||
      err.config?.url?.includes('/auth/register')

    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
