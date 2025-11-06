// src/components/atoms/IconButton.jsx
import React from 'react';
import { Button } from './Button';

export const IconButton = React.forwardRef(({ 
  icon, // React element or SVG
  label,
  className = '',
  ...props 
}, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="md"
      aria-label={label}
      className={`p-2 rounded-full ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';