// src/components/atoms/TextField.jsx
import React from 'react';
import { useId } from 'react';

export const TextField = React.forwardRef(({ 
  label,
  helpText,
  error,
  className = '',
  id: propId,
  ...props 
}, ref) => {
  const autoId = useId();
  const id = propId || autoId;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full px-3 py-2 bg-card border ${
          error ? 'border-red-500' : 'border-border'
        } rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        aria-invalid={!!error}
        aria-describedby={helpText || error ? `${id}-hint` : undefined}
        {...props}
      />
      {(helpText || error) && (
        <p
          id={`${id}-hint`}
          className={`text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {error || helpText}
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';