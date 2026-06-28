import api from './api'

const komposisiBahanService = {
  getAll: async (params = {}) => {
    const response = await api.get('/komposisi-bahan', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/komposisi-bahan/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/komposisi-bahan', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/komposisi-bahan/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/komposisi-bahan/${id}`)
    return response.data
  },

  getByJenisLayanan: async (jenisLayananId) => {
    const response = await api.get(`/komposisi-bahan/by-jenis-layanan/${jenisLayananId}`)
    return response.data
  },
}

export default komposisiBahanService
