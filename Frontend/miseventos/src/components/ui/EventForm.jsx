// src/components/ui/EventForm.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, TextField } from '@mui/material';
import Button from './Button';

const EventForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false,
  title = "Crear Evento"
}) => {

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lugar_general: '',
    fecha_inicio: '',
    fecha_fin: '',
    categoria: '',
    image_url: '',
    capacidad_maxima: '',
    recursos_de_evento: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.lugar_general.trim()) newErrors.lugar_general = 'El lugar es requerido';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    if (!formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es requerida';
    if (formData.fecha_inicio && formData.fecha_fin && new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      const cleanedData = { ...formData };
      if (cleanedData.capacidad_maxima === '') cleanedData.capacidad_maxima = null;
      if (cleanedData.image_url === '') cleanedData.image_url = null;
      if (cleanedData.recursos_de_evento === '') cleanedData.recursos_de_evento = null;
      onSubmit(cleanedData);
    }
  };


  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <TextField
                name="nombre"
                label="Nombre del evento"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                required
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="lugar_general"
                label="Lugar"
                value={formData.lugar_general}
                onChange={handleChange}
                error={!!errors.lugar_general}
                helperText={errors.lugar_general}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="categoria"
                label="Categoría"
                value={formData.categoria}
                onChange={handleChange}
                error={!!errors.categoria}
                helperText={errors.categoria}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="fecha_inicio"
                label="Fecha de inicio"
                type="datetime-local"
                value={formData.fecha_inicio}
                onChange={handleChange}
                error={!!errors.fecha_inicio}
                helperText={errors.fecha_inicio}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="fecha_fin"
                label="Fecha de fin"
                type="datetime-local"
                value={formData.fecha_fin}
                onChange={handleChange}
                error={!!errors.fecha_fin}
                helperText={errors.fecha_fin}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="capacidad_maxima"
                label="Capacidad máxima"
                type="number"
                value={formData.capacidad_maxima}
                onChange={handleChange}
                error={!!errors.capacidad_maxima}
                helperText={errors.capacidad_maxima || "Dejar vacío para sin límite"}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="image_url"
                label="URL de imagen"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                error={!!errors.image_url}
                helperText={errors.image_url}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="recursos_de_evento"
                label="Recursos del evento"
                value={formData.recursos_de_evento}
                onChange={handleChange}
                error={!!errors.recursos_de_evento}
                helperText={errors.recursos_de_evento}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  {initialData.id ? 'Actualizar Evento' : 'Crear Evento'}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventForm;