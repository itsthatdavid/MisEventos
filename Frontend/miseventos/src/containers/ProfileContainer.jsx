// src/containers/ProfileContainer.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistanceStore, useAuthStore, useUIStore } from '../stores';

// Material-UI Components
import { Container, Box, Paper, Typography, Grid, Alert, Divider } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Badge as RoleIcon } from '@mui/icons-material';

// UI Components
import LoadSpinner from '../components/ui/LoadSpinner';
import EventTile from '../components/ui/EventTile';


const ProfileContainer = () => {

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userRegistrations, loading, loadUserRegistrations } = useAssistanceStore();

  useEffect(() => {
    loadUserRegistrations();
  }, [loadUserRegistrations]);

  const handleEventClick = (evento) => {
    navigate(`/eventos/${evento.id}`);
  };

  if (loading && userRegistrations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <LoadSpinner size="large" text="Cargando tu perfil..." />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {/* Sección de Información del Perfil */}
      <Box mb={6}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Mi Perfil
        </Typography>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            <InfoGridItem icon={<PersonIcon />} title="Nombre" text={user?.nombre} />
            <InfoGridItem icon={<EmailIcon />} title="Email" text={user?.email} />
            <InfoGridItem icon={<RoleIcon />} title="Rol" text={user?.rol || 'Asistente'} />
          </Grid>
        </Paper>
      </Box>

      {/* Sección de Eventos Registrados */}
      <Box>
        <Typography variant="h4" component="h2" fontWeight="bold">
          Mis Eventos Registrados
        </Typography>
        <Divider sx={{ my: 2 }} />

        {userRegistrations.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Aún no te has registrado a ningún evento. ¡Explora los eventos disponibles!
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {userRegistrations.map((registration) => (
              registration.evento && ( // Asegurarse que el evento existe en el objeto de registro
                <Grid item key={registration.id} xs={12} sm={6} md={4}>
                  <EventTile
                    evento={registration.evento}
                    onEventClick={handleEventClick}
                    isRegistered={true}
                  />
                </Grid>
              )
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

// Helper sub-component para la información del perfil
const InfoGridItem = ({ icon, title, text }) => (
  <Grid item xs={12} sm={6}>
    <Box display="flex" alignItems="center" gap={1.5}>
      <Box color="text.secondary">{icon}</Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {text}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

export default ProfileContainer;