import api from './api'

const distributionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/distributions', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/distributions/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/distributions', data)
    return response.data
  },

  confirm: async (id) => {
    const response = await api.post(`/distributions/${id}/confirm`)
    return response.data
  },
}

export default distributionService
