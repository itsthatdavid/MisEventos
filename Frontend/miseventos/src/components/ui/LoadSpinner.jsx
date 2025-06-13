// src/components/ui/LoadSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadSpinner = ({ 
  size = 'medium',
  text = 'Cargando...', 
  className = '',
  showText = true 
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2
      }}
    >
      <CircularProgress size={spinnerSize} />
      {showText && text && (
        <Typography variant="body1" color="text.secondary">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LoadSpinner;