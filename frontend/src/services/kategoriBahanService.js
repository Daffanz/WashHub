import api from './api'

const kategoriBahanService = {
  getAll: async (params = {}) => {
    const response = await api.get('/kategori-bahan', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/kategori-bahan/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/kategori-bahan', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/kategori-bahan/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/kategori-bahan/${id}`)
    return response.data
  },

  getActive: async () => {
    const response = await api.get('/kategori-bahan/active')
    return response.data
  },
}

export default kategoriBahanService
