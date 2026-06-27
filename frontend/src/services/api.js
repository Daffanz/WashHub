import axios from 'axios'

/**
 * Base URL strategy:
 * - In dev: use '/api' so Vite proxy forwards to backend (no CORS issue)
 * - In prod: use VITE_API_URL env or fallback to backend URL
 *
 * See vite.config.js for proxy configuration.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('washhub_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout if 401 (but skip for the login endpoint itself)
    const isLoginRequest = error.config?.url?.includes('/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('washhub_token')
      localStorage.removeItem('washhub_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
