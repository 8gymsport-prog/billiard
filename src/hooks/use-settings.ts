"use client";

import { useContext } from 'react';
import { AppContext } from '@/context/app-provider';

export function useSettings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useSettings must be used within an AppProvider');
  }
  return context;
}
