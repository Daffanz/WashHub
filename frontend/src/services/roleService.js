import api from './api'

const roleService = {
  /**
   * Get all roles
   * Backend: GET /api/roles
   */
  getAll: async () => {
    const response = await api.get('/roles')
    return response.data
  },

  /**
   * Get single role by ID
   * Backend: GET /api/roles/{id}
   */
  getById: async (id) => {
    const response = await api.get(`/roles/${id}`)
    return response.data
  },

  /**
   * Create new role
   * Backend: POST /api/roles
   * Payload: { name, description?, permissions?: string[] }
   */
  create: async (data) => {
    const response = await api.post('/roles', data)
    return response.data
  },

  /**
   * Update existing role
   * Backend: PUT /api/roles/{id}
   */
  update: async (id, data) => {
    const response = await api.put(`/roles/${id}`, data)
    return response.data
  },

  /**
   * Delete role
   * Backend: DELETE /api/roles/{id}
   */
  delete: async (id) => {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  },

  /**
   * Get all permissions (for assignment)
   */
  getPermissions: async () => {
    const response = await api.get('/permissions')
    return response.data
  },
}

export default roleService
