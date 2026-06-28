import api from './api'

const purchaseOrderService = {
  getAll: async (params = {}) => {
    const response = await api.get('/purchase-orders', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/purchase-orders', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`)
    return response.data
  },

  send: async (id) => {
    const response = await api.post(`/purchase-orders/${id}/send`)
    return response.data
  },

  approve: async (id) => {
    const response = await api.post(`/purchase-orders/${id}/approve`)
    return response.data
  },

  reject: async (id) => {
    const response = await api.post(`/purchase-orders/${id}/reject`)
    return response.data
  },
}

export default purchaseOrderService
