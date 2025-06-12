import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../services/apiService';
import { setAuthToken } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions with Business Logic
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          
          const response = await apiService.auth.login(email, password);
          const { user, token } = response;
          
          // Set token in API service
          setAuthToken(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Error de autenticación';
          set({ 
            loading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          
          const response = await apiService.auth.register(userData);
          const { user, token } = response;
          
          setAuthToken(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Error en el registro';
          set({ 
            loading: false, 
            error: errorMessage 
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          // Try to call logout endpoint
          await apiService.auth.logout();
        } catch (error) {
          console.warn('Logout endpoint failed, continuing with client logout');
        } finally {
          // Always clear client state
          setAuthToken(null);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      // Initialize auth from persisted state
      initializeAuth: () => {
        const { token } = get();
        if (token) {
          setAuthToken(token);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);