// src/components/ui/EventTile.jsx
import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, Box } from '@mui/material';
import Chip from './Badge';
import Button from './Button';

// Material-UI Icons
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import ImageIcon from '@mui/icons-material/Image';


const EventTile = ({ evento, onEventClick, onRegisterClick, isRegistered = false }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusConfig = (estado) => {
    const configs = {
      'borrador': { variant: 'default', label: 'Borrador' },
      'teaser': { variant: 'info', label: 'Próximamente' },
      'preventa': { variant: 'warning', label: 'Preventa' },
      'venta': { variant: 'success', label: 'Disponible' },
      'en_progreso': { variant: 'info', label: 'En Progreso' },
      'terminado': { variant: 'default', label: 'Terminado' },
      'cancelado': { variant: 'error', label: 'Cancelado' },
      'suspendido': { variant: 'warning', label: 'Suspendido' }
    };
    return configs[estado] || { variant: 'default', label: estado };
  };

  const statusConfig = getStatusConfig(evento.estado);

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (onRegisterClick) {
      onRegisterClick(evento);
    }
  };

  return (
    <Card raised sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea onClick={() => onEventClick(evento)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <CardMedia
            component={evento.image_url ? 'img' : 'div'}
            height="180"
            image={evento.image_url || '/'}
            alt={evento.nombre}
            sx={{ backgroundColor: 'grey.200' }}
          >
            {!evento.image_url && (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
              </Box>
            )}
          </CardMedia>
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Chip variant={statusConfig.variant}>
              {statusConfig.label}
            </Chip>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
          <Typography gutterBottom variant="h6" component="h3" noWrap>
            {evento.nombre}
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1} my={1}>
            <InfoItem icon={<EventIcon fontSize="small" />} text={formatDate(evento.fecha_inicio)} />
            <InfoItem icon={<LocationOnIcon fontSize="small" />} text={evento.lugar_general} />
            {evento.categoria && (
              <InfoItem icon={<LocalOfferIcon fontSize="small" />} text={evento.categoria} />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {evento.descripcion?.length > 120 
              ? `${evento.descripcion.substring(0, 120)}...`
              : evento.descripcion
            }
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <InfoItem icon={<GroupsIcon />} text={evento.capacidad_maxima ? `Hasta ${evento.capacidad_maxima}` : 'Sin límite'} />
        
        <Box display="flex" gap={1}>
          {onRegisterClick && (
            <Button 
              variant={isRegistered ? "outline" : "primary"}
              size="small"
              onClick={handleRegisterClick}
            >
              {isRegistered ? 'Registrado' : 'Registrarse'}
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

// Helper sub-component for info items to reduce repetition
const InfoItem = ({ icon, text }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box component="span" display="flex" sx={{ color: 'text.secondary' }}>{icon}</Box>
    <Typography variant="body2" color="text.primary">{text}</Typography>
  </Box>
);

export default EventTile;