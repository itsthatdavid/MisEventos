// src/components/ui/Button.jsx
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-loading-content">
          <span className="btn-spinner"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;