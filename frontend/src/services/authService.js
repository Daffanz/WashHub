import api from './api'

const authService = {
  /**
   * Login user with email and password
   * Backend: POST /api/login
   */
  login: async (email, password) => {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  /**
   * Logout current user
   * Backend: POST /api/logout (auth:sanctum)
   */
  logout: async () => {
    const response = await api.post('/logout')
    return response.data
  },

  /**
   * Get authenticated user profile
   * Backend: GET /api/me (auth:sanctum)
   */
  me: async () => {
    const response = await api.get('/me')
    return response.data
  },
}

export default authService
