// export default function Button({ variant = "default", children, ...props }) {
//   const base = "btn";
//   const cls = variant === "primary" ? base + " btn-primary" : base;
//   return <button className={cls} {...props}>{children}</button>;
// }

// src/components/atoms/Button.jsx
import React from 'react';

export const Button = React.forwardRef(({ 
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}, ref) => {
  const base = "inline-flex items-center justify-center rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 focus-visible:ring-blue-500",
    outline: "border border-primary text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 focus-visible:ring-blue-500",
    ghost: "text-text hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';