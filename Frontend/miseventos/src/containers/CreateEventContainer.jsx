// src/containers/CreateEventContainer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsStore, useUIStore } from '../stores';

// Componentes de UI y Layout
import EventForm from '../components/ui/EventForm';
import { Container, Box, Typography, Paper } from '@mui/material';

const CreateEventContainer = () => {

  const navigate = useNavigate();
  const { createEvent, loading } = useEventsStore();
  const { showError, showSuccess } = useUIStore();

  const handleSubmit = async (eventData) => {
    try {
      const result = await createEvent(eventData);
      
      if (result.success) {
        showSuccess('Evento creado exitosamente');
        navigate(`/eventos/${result.data.id}`);
      } else {
        showError(result.error || 'Error al crear el evento');
      }
    } catch (error) {
      showError('Error inesperado al crear el evento');
    }
  };

  const handleCancel = () => {
    navigate('/eventos');
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Crear Nuevo Evento
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Completa los siguientes campos para registrar un nuevo evento en la plataforma.
        </Typography>
        
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 } }}>
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateEventContainer;