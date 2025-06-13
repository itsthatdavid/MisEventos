import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from './stores';

// Material-UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Component Imports
import ErrorBoundary from './components/ui/ErrorBoundary';
import ToastContainer from './components/ui/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import EventsListContainer from './containers/EventsListContainer';
import EventDetailContainer from './containers/EventDetailContainer';
import CreateEventContainer from './containers/CreateEventContainer';
import AuthContainer from './containers/AuthContainer';
import ProfileContainer from './containers/ProfileContainer';

function App() {
  const { initializeAuth } = useAuthStore();
  const { toasts, removeToast } = useUIStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/eventos" replace />} />
              <Route path="/eventos" element={<EventsListContainer />} />
              <Route path="/eventos/:id" element={<EventDetailContainer />} />
              <Route path="/login" element={<AuthContainer mode="login" />} />
              <Route path="/register" element={<AuthContainer mode="register" />} />
              
              {/* Protected Routes */}
              <Route path="/eventos/crear" element={
                <ProtectedRoute>
                  <CreateEventContainer />
                </ProtectedRoute>
              } />
              
              <Route path="/eventos/:id/editar" element={
                <ProtectedRoute>
                  <CreateEventContainer />
                </ProtectedRoute>
              } />
              
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <ProfileContainer />
                </ProtectedRoute>
              } />
              
              <Route path="/mis-eventos" element={
                <ProtectedRoute>
                  <ProfileContainer />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Página no encontrada
                  </Typography>
                  <Typography variant="body1">
                    La página que buscas no existe.
                  </Typography>
                </Box>
              } />
            </Routes>
          </Container>

          {/* Global Toast Container */}
          <ToastContainer 
            toasts={toasts} 
            onCloseToast={removeToast} 
          />
        </Box>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
