import api from './api'

const outletService = {
  getAll: async (params = {}) => {
    const response = await api.get('/outlets', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/outlets/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/outlets', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/outlets/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/outlets/${id}`)
    return response.data
  },
}

export default outletService
