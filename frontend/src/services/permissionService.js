import api from './api'

const permissionService = {
  /**
   * Get all permissions
   * Backend: GET /api/permissions
   */
  getAll: async () => {
    const response = await api.get('/permissions')
    return response.data
  },

  /**
   * Get single permission by ID
   * Backend: GET /api/permissions/{id}
   */
  getById: async (id) => {
    const response = await api.get(`/permissions/${id}`)
    return response.data
  },

  /**
   * Create new permission
   * Backend: POST /api/permissions
   */
  create: async (data) => {
    const response = await api.post('/permissions', data)
    return response.data
  },

  /**
   * Update existing permission
   * Backend: PUT /api/permissions/{id}
   */
  update: async (id, data) => {
    const response = await api.put(`/permissions/${id}`, data)
    return response.data
  },

  /**
   * Delete permission
   * Backend: DELETE /api/permissions/{id}
   */
  delete: async (id) => {
    const response = await api.delete(`/permissions/${id}`)
    return response.data
  },
}

export default permissionService
