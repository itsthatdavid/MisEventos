// src/components/ui/SearchInput.jsx
import React from 'react';
import { TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar evento por nombre...',
  loading = false,
  className = '',
  minLength = 3,
  showHint = true,
  ...props
}) => {
  // Determine the helper text based on the input value and props
  const getHelperText = () => {
    if (showHint && value.length > 0 && value.length < minLength) {
      return `Escribe al menos ${minLength} caracteres para buscar`;
    }
    return ' ';
  };

  return (
    <TextField
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      helperText={getHelperText()}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <SearchIcon />
            )}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default SearchInput;