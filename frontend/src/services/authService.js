import api from '../api/axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};
