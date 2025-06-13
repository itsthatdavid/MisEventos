// src/containers/EventDetailContainer.jsx (Enhanced MUI Version)
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventsStore, useSessionsStore, useAssistanceStore, useUIStore, useAuthStore } from '../stores';

// Material-UI Components
import { Container, Box, Paper, Typography, Grid, Chip, Divider, Card, CardMedia, CardContent } from '@mui/material';
import { Event as EventIcon, Place as PlaceIcon, People as PeopleIcon, Edit as EditIcon, Image as ImageIcon } from '@mui/icons-material';

// Refactored UI Components
import LoadSpinner from '../components/ui/LoadSpinner';
import Button from '../components/ui/Button';
import SessionItem from '../components/ui/SessionItem';
import Alert from '@mui/material/Alert';

const EventDetailContainer = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  
  const { currentEvent, loading: eventLoading, error: eventError, loadEventById, clearCurrentEvent, clearError: clearEventError } = useEventsStore();
  const { sessions, loading: sessionsLoading, error: sessionsError, loadSessionsByEventId, clearSessions, clearError: clearSessionsError } = useSessionsStore();
  const { registerToSession, unregisterFromSession, loadUserRegistrations, userRegistrations } = useAssistanceStore();
  const { showError, showSuccess } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const loadEventData = async () => {
      if (id) {
        const result = await loadEventById(id);
        if (result.success) {
          await loadSessionsByEventId(id);
          if (isAuthenticated) await loadUserRegistrations();
        }
      }
    };
    loadEventData();
    return () => { clearCurrentEvent(); clearSessions(); };
  }, [id, isAuthenticated, loadEventById, loadSessionsByEventId, loadUserRegistrations, clearCurrentEvent, clearSessions]);

  useEffect(() => {
    if (eventError) { showError(eventError); clearEventError(); }
    if (sessionsError) { showError(sessionsError); clearSessionsError(); }
  }, [eventError, sessionsError, showError, clearEventError, clearSessionsError]);

  const isUserRegisteredToSession = (sessionId) => userRegistrations.some(reg => reg.session_id === sessionId);

  const handleSessionRegister = async (session) => {
    if (!isAuthenticated) {
      showError('Debes iniciar sesión para registrarte');
      navigate('/login');
      return;
    }
    const isRegistered = isUserRegisteredToSession(session.id);
    const action = isRegistered ? unregisterFromSession : registerToSession;
    const message = isRegistered ? 'Te has desregistrado de la sesión' : 'Te has registrado exitosamente';
    try {
      const result = await action(currentEvent.id, session.id);
      if (result.success) showSuccess(message);
    } catch (error) {
      showError('Error al procesar el registro');
    }
  };

  const handleEditEvent = () => navigate(`/eventos/${id}/editar`);

  const canEditEvent = () => isAuthenticated && user && currentEvent && (user.rol === 'admin' || currentEvent.creador_id === user.id);


  // Design
  if (eventLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <LoadSpinner size="large" text="Cargando evento..." />
      </Box>
    );
  }

  if (!currentEvent) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Evento no encontrado</Typography>
          <Typography color="text.secondary">El evento que buscas no existe o fue eliminado.</Typography>
          <Button variant="primary" onClick={() => navigate('/eventos')} sx={{ mt: 3 }}>
            Volver a eventos
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {/* Tarjeta principal del evento con imagen */}
      <Card variant="outlined">
        <CardMedia
          component="div"
          sx={{ height: { xs: 200, sm: 300, md: 400 }, backgroundColor: 'grey.200' }}
        >
          {currentEvent.image_url ? (
            <Box
              component="img"
              src={currentEvent.image_url}
              alt={currentEvent.nombre}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <ImageIcon sx={{ fontSize: 80, color: 'grey.400' }} />
            </Box>
          )}
        </CardMedia>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Chip label={currentEvent.categoria || 'General'} color="secondary" size="small" />
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                {currentEvent.nombre}
              </Typography>
            </Box>
            {canEditEvent() && (
              <Button variant="outline" onClick={handleEditEvent} startIcon={<EditIcon />}>
                Editar Evento
              </Button>
            )}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {currentEvent.descripcion}
          </Typography>
          <Grid container spacing={3}>
            <InfoGridItem icon={<PlaceIcon />} title="Lugar" text={currentEvent.lugar_general} />
            <InfoGridItem icon={<EventIcon />} title="Fecha inicio" text={new Date(currentEvent.fecha_inicio).toLocaleDateString('es-ES', {dateStyle: 'long'})} />
            <InfoGridItem icon={<EventIcon />} title="Fecha fin" text={new Date(currentEvent.fecha_fin).toLocaleDateString('es-ES', {dateStyle: 'long'})} />
            {currentEvent.capacidad_maxima && (
              <InfoGridItem icon={<PeopleIcon />} title="Capacidad" text={`${currentEvent.capacidad_maxima} personas`} />
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Sección de Sesiones */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Sesiones del Evento
        </Typography>
        {sessionsLoading ? (
          <LoadSpinner text="Cargando sesiones..." />
        ) : sessions.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>Este evento aún no tiene sesiones programadas.</Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                sesion={session}
                onRegisterClick={handleSessionRegister}
                isRegistered={isUserRegisteredToSession(session.id)}
                canEdit={canEditEvent()}
              />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

// Helper sub-component
const InfoGridItem = ({ icon, title, text }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Box display="flex" alignItems="center" gap={1.5}>
      <Box color="text.secondary">{icon}</Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="body1" fontWeight="medium">{text}</Typography>
      </Box>
    </Box>
  </Grid>
);

export default EventDetailContainer;