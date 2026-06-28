import api from './api'

const bahanBakuService = {
  getAll: async (params = {}) => {
    const response = await api.get('/bahan-baku', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/bahan-baku/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/bahan-baku', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/bahan-baku/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/bahan-baku/${id}`)
    return response.data
  },

  getByKategori: async (kategoriId) => {
    const response = await api.get(`/bahan-baku/by-kategori/${kategoriId}`)
    return response.data
  },
}

export default bahanBakuService
