// src/components/ui/Card.jsx
import React from 'react';
import { Card as MuiCard, CardContent, CardActionArea, Box } from '@mui/material';

const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'normal',
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return 1;
      case 'large':
        return 3;
      case 'normal':
      default:
        return 2;
    }
  };

  const cardContent = (
    <CardContent sx={{ p: getPadding() }}>
      {children}
    </CardContent>
  );

  if (onClick || hoverable) {
    return (
      <MuiCard raised className={className} {...props}>
        <CardActionArea onClick={onClick} disabled={!onClick}>
          {cardContent}
        </CardActionArea>
      </MuiCard>
    );
  }

  return (
    <MuiCard raised className={className} {...props}>
      {cardContent}
    </MuiCard>
  );
};

export default Card;