import api from '../api/axios';

export const permissionService = {
  getAll: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },
};
