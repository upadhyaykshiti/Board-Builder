
// src/components/layout/AppLayout.jsx
import React from 'react';
import { Header } from './Header';

export const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-bg text-text">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
};