import api from './api';

export const authService = {
  login: async (email, password) => {
    // Usar FormData para OAuth2PasswordRequestForm
    const formData = new FormData();
    formData.append('username', email); // Backend espera 'username', no 'email'
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData) => {
    // Mapear 'name' a 'nombre' para el backend
    const backendData = {
      ...userData,
      nombre: userData.name, // Backend espera 'nombre'
    };
    delete backendData.name; // Remover el campo 'name'
    
    const response = await api.post('/auth/register', backendData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    // El backend no tiene endpoint de logout, solo limpiar token
    return Promise.resolve();
  },
};