// src/components/ui/Badge.jsx
import React from 'react';
import { Chip } from '@mui/material';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
}) => {
  const chipColor = ['success', 'error', 'warning', 'info', 'primary', 'secondary'].includes(variant) 
    ? variant 
    : 'default';

  return (
    <Chip
      label={children}
      color={chipColor}
      size={size}
      className={className}
    />
  );
};

export default Badge;