import api from './api'

const receivingService = {
  getAll: async (params = {}) => {
    const response = await api.get('/receivings', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/receivings/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/receivings', data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/receivings/${id}`)
    return response.data
  },
}

export default receivingService
