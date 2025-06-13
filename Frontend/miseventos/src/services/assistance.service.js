import api from './api';

export const assistanceService = {
  registerToSession: async (eventId, sessionId) => {
    const response = await api.post(`/events/${eventId}/sessions/${sessionId}/register`);
    return response.data;
  },

  unregisterFromSession: async (eventId, sessionId) => {
    const response = await api.delete(`/events/${eventId}/sessions/${sessionId}/register`);
    return response.data;
  },

  getUserRegistrations: async () => {
    const response = await api.get('/users/me/events');
    return response.data;
  },
};