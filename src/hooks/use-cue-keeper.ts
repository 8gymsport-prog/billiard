"use client";

import { useContext } from 'react';
import { AppContext } from '@/context/app-provider';

export function useCueKeeper() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useCueKeeper must be used within an AppProvider');
  }
  return context;
}
