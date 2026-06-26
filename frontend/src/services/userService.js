import api from './api'

const userService = {
  /**
   * Get paginated list of users
   */
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  /**
   * Get single user by ID
   */
  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  /**
   * Create new user
   */
  create: async (data) => {
    const response = await api.post('/users', data)
    return response.data
  },

  /**
   * Update existing user
   */
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  /**
   * Delete user
   */
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  /**
   * Update own profile
   */
  updateProfile: async (data) => {
    const response = await api.put('/profile', data)
    return response.data
  },

  /**
   * Change own password
   */
  changePassword: async (data) => {
    const response = await api.put('/profile/password', data)
    return response.data
  },
}

export default userService
