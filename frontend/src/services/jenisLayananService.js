import api from './api'

const jenisLayananService = {
  getAll: async (params = {}) => {
    const response = await api.get('/jenis-layanan', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/jenis-layanan/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/jenis-layanan', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/jenis-layanan/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/jenis-layanan/${id}`)
    return response.data
  },
}

export default jenisLayananService
