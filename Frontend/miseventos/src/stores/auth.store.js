import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
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
          
          // Backend retorna: {access_token: "...", token_type: "bearer"}
          const response = await authService.login(email, password);
          const token = response.access_token;
          
          // Set token in API service
          setAuthToken(token);
          
          // Para obtener los datos del usuario, necesitamos un endpoint adicional
          // Por ahora, usamos datos básicos del email
          const user = { email, nombre: email.split('@')[0] };
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Error de autenticación';
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
          
          // Backend retorna el usuario creado directamente
          const user = await authService.register(userData);
          
          // Después del registro, hacer login automático
          const loginResult = await get().login(userData.email, userData.password);
          
          if (loginResult.success) {
            return { success: true };
          } else {
            throw new Error('Error en login automático después del registro');
          }
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Error en el registro';
          set({ 
            loading: false, 
            error: errorMessage 
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
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