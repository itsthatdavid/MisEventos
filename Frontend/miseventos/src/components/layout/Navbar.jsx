// src/components/layout/Navbar.jsx
import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../stores';

// Material-UI Components
import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { showSuccess } = useUIStore();

  const handleLogout = async () => {
    await logout();
    showSuccess('Sesión cerrada exitosamente');
    navigate('/eventos');
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {/* Brand and Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/eventos" 
            sx={{ textDecoration: 'none', color: 'inherit', mr: 4 }}
          >
            MisEventos
          </Typography>

          <Box component="nav">
            <Link
              component={RouterLink}
              to="/eventos"
              underline="none"
              sx={{ 
                mr: 2, 
                fontWeight: isActiveRoute('/eventos') ? 'bold' : 'normal',
                color: isActiveRoute('/eventos') ? 'primary.main' : 'inherit'
              }}
            >
              Eventos
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  component={RouterLink}
                  to="/mis-eventos"
                  underline="none"
                  sx={{ 
                    mr: 2, 
                    fontWeight: isActiveRoute('/mis-eventos') ? 'bold' : 'normal',
                    color: isActiveRoute('/mis-eventos') ? 'primary.main' : 'inherit'
                  }}
                >
                  Mis Eventos
                </Link>
                <Link
                  component={RouterLink}
                  to="/eventos/crear"
                  underline="none"
                  sx={{ 
                    fontWeight: isActiveRoute('/eventos/crear') ? 'bold' : 'normal',
                    color: isActiveRoute('/eventos/crear') ? 'primary.main' : 'inherit'
                  }}
                >
                  Crear Evento
                </Link>
              </>
            )}
          </Box>
        </Box>

        {/* Actions and User Info */}
        <Box>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">
                Hola, {user?.nombre}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => navigate('/perfil')}
              >
                Perfil
              </Button>
              <Button 
                color="secondary"
                variant="contained" 
                size="small" 
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;