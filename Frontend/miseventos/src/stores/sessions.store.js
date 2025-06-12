import { create } from 'zustand';
import { apiService } from '../services/apiService';

export const useSessionsStore = create((set) => ({
  // State
  sessions: [],
  loading: false,
  error: null,

  // Actions with Business Logic
  loadSessionsByEventId: async (eventId) => {
    try {
      set({ loading: true, error: null });
      
      const sessions = await apiService.sessions.getByEventId(eventId);
      
      set({
        sessions: sessions || [],
        loading: false,
      });

      return { success: true, data: sessions };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar sesiones';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  createSession: async (eventId, sessionData) => {
    try {
      set({ loading: true, error: null });
      
      const newSession = await apiService.sessions.create(eventId, sessionData);
      
      set((state) => ({
        sessions: [...state.sessions, newSession],
        loading: false,
      }));

      return { success: true, data: newSession };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear sesión';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  updateSession: async (eventId, sessionId, sessionData) => {
    try {
      set({ loading: true, error: null });
      
      const updatedSession = await apiService.sessions.update(eventId, sessionId, sessionData);
      
      set((state) => ({
        sessions: state.sessions.map(session => 
          session.id === sessionId ? updatedSession : session
        ),
        loading: false,
      }));

      return { success: true, data: updatedSession };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar sesión';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  deleteSession: async (eventId, sessionId) => {
    try {
      set({ loading: true, error: null });
      
      await apiService.sessions.delete(eventId, sessionId);
      
      set((state) => ({
        sessions: state.sessions.filter(session => session.id !== sessionId),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar sesión';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  clearSessions: () => set({ sessions: [] }),
  clearError: () => set({ error: null }),
}));