"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { BilliardTable, Session, AppSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useSessionWatcher } from '@/hooks/use-session-watcher';

const isServer = typeof window === 'undefined';

// Komponen baru untuk mendaftarkan Service Worker
function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.error('Service Worker registration failed:', error));
    }
  }, []);

  return null;
}

// Komponen baru untuk meng-host hook pengamat sesi
function SessionWatcher() {
  useSessionWatcher();
  return null;
}

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (isServer) return defaultValue;
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key '${key}':`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!isServer) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error setting localStorage key '${key}':`, error);
      }
    }
  }, [key, state]);

  return [state, setState];
}

interface AppContextType {
  tables: BilliardTable[];
  addTable: (name: string) => void;
  updateTable: (id: string, name: string) => void;
  removeTable: (id: string) => void;
  sessions: Session[];
  startSession: (tableId: string, durationMinutes: number) => void;
  endSession: (sessionId: string) => Session | undefined;
  activeSessions: Session[];
  finishedSessions: Session[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  getTableById: (id: string) => BilliardTable | undefined;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [tables, setTables] = usePersistentState<BilliardTable[]>('cuekeeper_tables', [
    { id: '1', name: 'Meja 1' },
    { id: '2', name: 'Meja 2' },
    { id: '3', name: 'Meja 3' },
  ]);
  const [sessions, setSessions] = usePersistentState<Session[]>('cuekeeper_sessions', []);
  const [settings, setSettings] = usePersistentState<AppSettings>('cuekeeper_settings', { 
    hourlyRate: 25000,
    notificationsEnabled: false // Default ke false, pengguna harus mengaktifkan secara manual
  });

  const notify = (options: any) => {
    // Toast notifikasi selalu ditampilkan, terlepas dari pengaturan notifikasi push
    toast(options);
  }

  const addTable = (name: string) => {
    const newTable: BilliardTable = { id: crypto.randomUUID(), name };
    setTables(prev => [...prev, newTable]);
    notify({ title: "Meja Ditambahkan", description: `Meja "${name}" telah dibuat.` });
  };

  const updateTable = (id: string, name: string) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    notify({ title: "Meja Diperbarui", description: `Meja telah diubah namanya menjadi "${name}".` });
  }

  const removeTable = (id: string) => {
    if (sessions.some(s => s.tableId === id && s.status === 'active')) {
      notify({ variant: 'destructive', title: "Tidak Dapat Menghapus Meja", description: "Meja ini sedang digunakan." });
      return;
    }
    setTables(prev => prev.filter(t => t.id !== id));
    notify({ title: "Meja Dihapus" });
  };

  const startSession = (tableId: string, durationMinutes: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newSession: Session = {
      id: crypto.randomUUID(),
      tableId,
      tableName: table.name,
      startTime: Date.now(),
      durationMinutes,
      status: 'active',
    };
    setSessions(prev => [...prev, newSession]);
  };

  const endSession = useCallback((sessionId: string): Session | undefined => {
    let endedSession: Session | undefined = undefined;
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId && s.status === 'active') {
          const endTime = Date.now();
          const elapsedMinutes = (endTime - s.startTime) / (1000 * 60);
          const cost = (elapsedMinutes / 60) * settings.hourlyRate;
          
          endedSession = { ...s, endTime, status: 'finished', cost: Math.round(cost) };
          return endedSession;
        }
        return s;
      })
    );
    return endedSession;
  }, [settings.hourlyRate]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if(newSettings.hourlyRate !== undefined) {
      notify({ title: "Pengaturan Diperbarui" });
    }
  };

  const getTableById = useCallback((id: string) => tables.find(t => t.id === id), [tables]);
  
  const activeSessions = sessions.filter(s => s.status === 'active');
  const finishedSessions = sessions.filter(s => s.status === 'finished').sort((a, b) => (b.endTime ?? 0) - (a.endTime ?? 0));

  const value = {
    tables,
    addTable,
    updateTable,
    removeTable,
    sessions,
    startSession,
    endSession,
    activeSessions,
    finishedSessions,
    settings,
    updateSettings,
    getTableById,
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContext.Provider value={value}>
        <ServiceWorkerRegistration />
        {children}
        <SessionWatcher />
      </AppContext.Provider>
    </NextThemesProvider>
  );
}
