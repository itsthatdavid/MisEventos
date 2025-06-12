// src/containers/EventsListContainer.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsStore, useUIStore, useAuthStore } from '../stores';

// Material-UI Components
import { Container, Box, Typography, Grid, Paper } from '@mui/material';
import { Add as AddIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';

// UI Components
import EventTile from '../components/ui/EventTile';
import SearchInput from '../components/ui/SearchInput';
import Pagination from '../components/ui/Pagination';
import LoadSpinner from '../components/ui/LoadSpinner';
import Button from '../components/ui/Button';

const EventsListContainer = () => {

  const navigate = useNavigate();
  const { events, loading, error, pagination, searchQuery, loadEvents, searchEvents, clearError } = useEventsStore();
  const { showError } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadEvents(1);
  }, [loadEvents]);

  useEffect(() => {
    if (error) { showError(error); clearError(); }
  }, [error, showError, clearError]);

  const debounceSearch = useCallback(
    (() => {
      let timeout;
      return (query) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (query.length >= 3 || query.length === 0) {
            setIsSearching(true);
            try {
              if (query.trim() === '') await loadEvents(1);
              else await searchEvents(query);
            } finally {
              setIsSearching(false);
            }
          }
        }, 500);
      };
    })(), [loadEvents, searchEvents]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debounceSearch(value);
  };
  
  const handleEventClick = (evento) => navigate(`/eventos/${evento.id}`);
  const handleRegisterClick = (evento) => {
    if (!isAuthenticated) {
      showError('Debes iniciar sesión para registrarte');
      navigate('/login');
      return;
    }
    navigate(`/eventos/${evento.id}`);
  };
  const handlePageChange = async (page) => {
    await loadEvents(page);
  };
  const handleCreateEvent = () => navigate('/eventos/crear');


  // Design
  const renderContent = () => {
    if (loading && events.length === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <LoadSpinner size="large" text="Cargando eventos..." />
        </Box>
      );
    }

    if (events.length === 0) {
      return (
        <Paper sx={{ textAlign: 'center', p: { xs: 3, sm: 5 }, mt: 4 }}>
          <SearchOffIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            No se encontraron eventos
          </Typography>
          <Typography color="text.secondary">
            {searchValue ? 'Intenta con otros términos de búsqueda.' : 'Aún no hay eventos disponibles.'}
          </Typography>
          {isAuthenticated && !searchValue && (
            <Button onClick={handleCreateEvent} variant="primary" sx={{ mt: 3 }}>
              Crear el primer evento
            </Button>
          )}
        </Paper>
      );
    }

    return (
      <>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {events.map((evento) => (
            <Grid item key={evento.id} xs={12} sm={6} md={4}>
              <EventTile
                evento={evento}
                onEventClick={handleEventClick}
                onRegisterClick={handleRegisterClick}
              />
            </Grid>
          ))}
        </Grid>
        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        flexWrap="wrap"
        gap={2}
        mb={4}
      >
        <Typography variant="h3" component="h1" fontWeight="bold">
          Eventos Disponibles
        </Typography>
        {isAuthenticated && (
          <Button onClick={handleCreateEvent} variant="primary" startIcon={<AddIcon />}>
            Crear Evento
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          loading={isSearching}
        />
      </Box>

      {renderContent()}
    </Container>
  );
};

export default EventsListContainer;