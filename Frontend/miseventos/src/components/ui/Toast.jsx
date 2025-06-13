// src/components/ui/ToastNotifier.jsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';


const ToastNotifier = ({ toast, onClose }) => {
  // The Snackbar is open if there is a toast object to display
  const isOpen = Boolean(toast);

  // This handler will be called by Snackbar on auto-hide or by the Alert's close button
  const handleClose = (event, reason) => {
    // Prevent closing on user click-away, only on timeout or close button
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={toast.duration || 6000}
      onClose={handleClose}
      // Position the snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {/* The Alert component provides the color, icon, and close button */}
      <Alert
        onClose={handleClose}
        severity={toast.type || 'info'} // success, error, warning, info
        variant="filled"
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotifier;