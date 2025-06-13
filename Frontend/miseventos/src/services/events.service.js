import api from './api';

export const eventsService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const params = { page, limit };
    if (search) params.q = search;
    
    const response = await api.get('/events', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/events/search', { params: { q: query } });
    return response.data;
  },
};