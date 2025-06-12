import api from './api';

export const usersService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  getEvents: async () => {
    const response = await api.get('/users/me/events');
    return response.data;
  },
};