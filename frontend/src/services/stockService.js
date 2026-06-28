import api from './api'

const stockService = {
  getAll: async (params = {}) => {
    const response = await api.get('/stock', { params })
    return response.data
  },

  getLowStock: async (outletId) => {
    const response = await api.get('/stock/low-stock', { params: { outlet_id: outletId } })
    return response.data
  },

  getMutasi: async (params = {}) => {
    const response = await api.get('/stock/mutasi', { params })
    return response.data
  },
}

export default stockService
