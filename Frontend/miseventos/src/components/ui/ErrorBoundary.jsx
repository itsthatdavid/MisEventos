// src/components/ui/ErrorBoundary.jsx
import React from 'react';
import { Box, Typography, Card as MuiCard } from '@mui/material';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: '80vh', p: 2 }}
        >
          <MuiCard raised sx={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
            <Box 
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              sx={{ p: 4 }}
            >
              <Typography variant="h4" component="div">
                ⚠️
              </Typography>
              <Typography variant="h5" component="h2" fontWeight="bold">
                ¡Oops! Algo salió mal
              </Typography>
              <Typography color="text.secondary">
                Lo sentimos, ha ocurrido un error inesperado en la aplicación.
              </Typography>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  component="details"
                  sx={{ 
                    width: '100%', 
                    mt: 2,
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'left'
                  }}
                >
                  <Box component="summary" sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
                    Detalles del error (modo desarrollo)
                  </Box>
                  <Box 
                    component="pre" 
                    sx={{ 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-all', 
                      fontSize: '0.8rem',
                      mt: 1,
                      p: 1,
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Box>
                </Box>
              )}
              
              <Box display="flex" gap={2} sx={{ mt: 3 }}>
                <Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                >
                  Recargar página
                </Button>
                
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                >
                  Volver atrás
                </Button>
              </Box>
            </Box>
          </MuiCard>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;