import api from './api';

export const sessionsService = {
  getByEventId: async (eventId) => {
    const response = await api.get(`/events/${eventId}/sessions`);
    return response.data;
  },

  getById: async (eventId, sessionId) => {
    const response = await api.get(`/events/${eventId}/sessions/${sessionId}`);
    return response.data;
  },

  create: async (eventId, sessionData) => {
    const response = await api.post(`/events/${eventId}/sessions`, sessionData);
    return response.data;
  },

  update: async (eventId, sessionId, sessionData) => {
    const response = await api.put(`/events/${eventId}/sessions/${sessionId}`, sessionData);
    return response.data;
  },

  delete: async (eventId, sessionId) => {
    const response = await api.delete(`/events/${eventId}/sessions/${sessionId}`);
    return response.data;
  },
};