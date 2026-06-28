import api from './api'

const mesinService = {
  getAll: async (params = {}) => {
    const response = await api.get('/mesin', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/mesin/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/mesin', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/mesin/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/mesin/${id}`)
    return response.data
  },
}

export default mesinService
