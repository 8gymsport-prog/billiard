"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { BilliardTable, Session, AppSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const isServer = typeof window === 'undefined';

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (isServer) return defaultValue;
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!isServer) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
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
  const [settings, setSettings] = usePersistentState<AppSettings>('cuekeeper_settings', { hourlyRate: 25000 });

  const addTable = (name: string) => {
    const newTable: BilliardTable = { id: crypto.randomUUID(), name };
    setTables(prev => [...prev, newTable]);
    toast({ title: "Meja Ditambahkan", description: `Meja "${name}" telah dibuat.` });
  };

  const updateTable = (id: string, name: string) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    toast({ title: "Meja Diperbarui", description: `Meja telah diubah namanya menjadi "${name}".` });
  }

  const removeTable = (id: string) => {
    if (sessions.some(s => s.tableId === id && s.status === 'active')) {
      toast({ variant: 'destructive', title: "Tidak Dapat Menghapus Meja", description: "Meja ini sedang digunakan." });
      return;
    }
    setTables(prev => prev.filter(t => t.id !== id));
    toast({ title: "Meja Dihapus" });
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
          
          endedSession = { ...s, endTime, status: 'finished', cost: parseFloat(cost.toFixed(2)) };
          return endedSession;
        }
        return s;
      })
    );
    return endedSession;
  }, [settings.hourlyRate]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast({ title: "Pengaturan Diperbarui" });
  };

  const getTableById = (id: string) => tables.find(t => t.id === id);
  
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
