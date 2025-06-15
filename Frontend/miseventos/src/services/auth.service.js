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
    const backendData = {
      ...userData,
      nombre: userData.name,
    };
    delete backendData.name;
    
    const response = await api.post('/auth/register', backendData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    return Promise.resolve();
  },
};