// src/components/ui/Input.jsx
import React from 'react';
import { TextField } from '@mui/material';

const Input = ({
  label,
  as = 'input',
  error,
  help,
  required = false,
  ...props
}) => {
  return (
    <TextField
      label={label}
      required={required}
      fullWidth

      multiline={as === 'textarea'}
      
      error={!!error}
      helperText={error || help}

      {...props}
    />
  );
};

export default Input;