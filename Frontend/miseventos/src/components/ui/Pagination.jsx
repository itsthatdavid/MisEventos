// src/components/ui/Pagination.jsx
import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showInfo = true,
}) => {
  // We just need to provide the page, count, and an onChange handler.
  if (totalPages <= 1) {
    return null;
  }


  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        my: 4,
      }}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        variant="outlined"
        shape="rounded"
        showFirstButton
        showLastButton
      />
      {showInfo && (
        <Typography variant="body2" color="text.secondary">
          Página {currentPage} de {totalPages}
        </Typography>
      )}
    </Box>
  );
};

export default Pagination;