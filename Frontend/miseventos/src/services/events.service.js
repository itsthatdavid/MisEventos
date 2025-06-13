import api from './api';

export const eventsService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/events?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    // Mapear campos del frontend al backend si es necesario
    const backendData = {
      name: eventData.name,
      general_location: eventData.location || eventData.general_location,
      category: eventData.category,
      description: eventData.description,
      start_date: eventData.startDate || eventData.start_date,
      end_date: eventData.endDate || eventData.end_date,
      image_url: eventData.imageUrl || eventData.image_url,
    };
    
    const response = await api.post('/events', backendData);
    return response.data;
  },

  update: async (id, eventData) => {
    // Mapear campos similares a create
    const backendData = {
      name: eventData.name,
      general_location: eventData.location || eventData.general_location,
      category: eventData.category,
      description: eventData.description,
      start_date: eventData.startDate || eventData.start_date,
      end_date: eventData.endDate || eventData.end_date,
      image_url: eventData.imageUrl || eventData.image_url,
    };
    
    const response = await api.patch(`/events/${id}`, backendData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/events/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  publish: async (id) => {
    const response = await api.post(`/events/${id}/publish`);
    return response.data;
  },
};