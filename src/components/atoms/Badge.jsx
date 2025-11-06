
// src/components/atoms/Badge.jsx
import React from 'react';

const colorMap = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const Badge = ({ children, color = 'gray', className = '' }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        colorMap[color] || colorMap.gray
      } ${className}`}
    >
      {children}
    </span>
  );
};