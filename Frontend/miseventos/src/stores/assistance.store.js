import { create } from 'zustand';
import { apiService } from '../services/apiService';

export const useAssistanceStore = create((set) => ({
  // State
  userRegistrations: [],
  loading: false,
  error: null,

  // Actions with Business Logic
  registerToSession: async (eventId, sessionId) => {
    try {
      set({ loading: true, error: null });
      
      const registration = await apiService.assistance.registerToSession(eventId, sessionId);
      
      set((state) => ({
        userRegistrations: [...state.userRegistrations, registration],
        loading: false,
      }));

      return { success: true, data: registration };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrarse al evento';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  unregisterFromSession: async (eventId, sessionId) => {
    try {
      set({ loading: true, error: null });
      
      await apiService.assistance.unregisterFromSession(eventId, sessionId);
      
      set((state) => ({
        userRegistrations: state.userRegistrations.filter(
          reg => !(reg.event_id === eventId && reg.session_id === sessionId)
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cancelar registro';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  loadUserRegistrations: async () => {
    try {
      set({ loading: true, error: null });
      
      const registrations = await apiService.assistance.getUserRegistrations();
      
      set({
        userRegistrations: registrations || [],
        loading: false,
      });

      return { success: true, data: registrations };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar registros';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));