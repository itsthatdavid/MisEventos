// src/containers/AuthContainer.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../stores';

// Material-UI Components
import { Container, Box, Paper, Typography, Grid, Link, Avatar, IconButton, InputAdornment } from '@mui/material';
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from '@mui/icons-material';

// UI Components
import TextField from '../components/ui/Input';
import Button from '../components/ui/Button';


const AuthContainer = ({ mode = 'login' }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/eventos';

  const { login, register, loading } = useAuthStore();
  const { showError, showSuccess } = useUIStore();

  const [formData, setFormData] = useState({ email: '', password: '', nombre: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    if (mode === 'register') {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const result = mode === 'login'
        ? await login(formData.email, formData.password)
        : await register({ email: formData.email, password: formData.password, name: formData.nombre });

      if (result.success) {
        showSuccess(mode === 'login' ? 'Bienvenido' : 'Cuenta creada exitosamente');
        navigate(from, { replace: true });
      } else {
        showError(result.error || 'Error en la autenticación');
      }
    } catch (error) {
      showError('Error inesperado');
    }
  };

  const toggleMode = () => {
    navigate(mode === 'login' ? '/register' : '/login', { state: { from: location.state?.from } });
  };

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  // Design
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {mode === 'register' && (
              <Grid item xs={12}>
                <TextField name="nombre" label="Nombre completo" value={formData.nombre} onChange={handleChange} error={errors.nombre} required />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {mode === 'register' && (
              <Grid item xs={12}>
                <TextField name="confirmPassword" label="Confirmar contraseña" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
              </Grid>
            )}
          </Grid>
          <Button type="submit" variant="primary" loading={loading} fullWidth sx={{ mt: 3, mb: 2 }}>
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component="button" type="button" onClick={toggleMode} variant="body2">
                {mode === 'login' ? '¿No tienes cuenta? Crear cuenta' : '¿Ya tienes cuenta? Iniciar sesión'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthContainer;