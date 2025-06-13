// src/components/ui/SessionItem.jsx
import React from 'react';
import { Box, Paper, Typography, Chip, Divider } from '@mui/material';
import Button from './Button';

// Material-UI Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SessionItem = ({ 
  sesion, 
  onRegisterClick, 
  onEditClick,
  isRegistered = false,
  canEdit = false,
  showRegisterButton = true
}) => {

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusConfig = (estado) => {
    const configs = {
      'venta': { color: 'success', label: 'Disponible' },
      'en_progreso': { color: 'info', label: 'En Progreso' },
      'terminado': { color: 'default', label: 'Terminado' },
      'cancelado': { color: 'error', label: 'Cancelado' },
    };
    return configs[estado] || { color: 'default', label: estado };
  };

  const statusConfig = getStatusConfig(sesion.estado);
  const dateTime = formatDateTime(sesion.fecha_hora);

  const handleRegisterClick = () => onRegisterClick?.(sesion);
  const handleEditClick = () => onEditClick?.(sesion);

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
        {/* Main Info Section */}
        <Box flexGrow={1}>
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <Typography variant="h6" component="h4" fontWeight="bold">
              Sesión: {sesion.presentador || 'Sin presentador'}
            </Typography>
            <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
          </Box>
          <Box display="flex" flexDirection="column" gap={0.5}>
            {sesion.lugar && <InfoItem icon={<LocationOnIcon fontSize="small" />} text={sesion.lugar} />}
            <InfoItem 
              icon={<GroupsIcon fontSize="small" />} 
              text={sesion.capacidad_maxima ? `Capacidad: ${sesion.capacidad_maxima} personas` : 'Sin límite de capacidad'} 
            />
            {sesion.recursos_de_sesion && <InfoItem icon={<ArticleIcon fontSize="small" />} text={`Recursos: ${sesion.recursos_de_sesion}`} />}
          </Box>
        </Box>

        {/* Date and Time Section */}
        <Box textAlign="right">
          <InfoItem icon={<CalendarMonthIcon fontSize="small" />} text={dateTime.date} justifyContent="flex-end" />
          <InfoItem icon={<AccessTimeIcon fontSize="small" />} text={dateTime.time} justifyContent="flex-end" />
        </Box>
      </Box>

      {/* Actions */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {canEdit && (
          <Button variant="outline" size="small" onClick={handleEditClick}>
            Editar
          </Button>
        )}
        {showRegisterButton && (
          <Button
            variant={isRegistered ? "outline" : "primary"}
            size="small"
            onClick={handleRegisterClick}
            disabled={sesion.estado === 'terminado' || sesion.estado === 'cancelado'}
          >
            {isRegistered ? 'Cancelar Registro' : 'Registrarse'}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

// Helper sub-component for info items to reduce repetition
const InfoItem = ({ icon, text, justifyContent = 'flex-start' }) => (
  <Box display="flex" alignItems="center" gap={0.5} justifyContent={justifyContent}>
    <Box component="span" display="flex" sx={{ color: 'text.secondary', mt: '2px' }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary">{text}</Typography>
  </Box>
);

export default SessionItem;