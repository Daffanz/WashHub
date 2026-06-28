import api from './api'

const minimumStockService = {
  getAll: async (params = {}) => {
    const response = await api.get('/minimum-stock', { params })
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/minimum-stock', data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/minimum-stock/${id}`)
    return response.data
  },
}

export default minimumStockService
