"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

type Status = 'loading' | 'ok' | 'error';

export function BackendStatus() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setStatus('ok');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkStatus(); // Pengecekan awal
    const interval = setInterval(checkStatus, 30000); // Cek setiap 30 detik

    return () => clearInterval(interval);
  }, []);

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Memeriksa Backend...</Badge>;
      case 'ok':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Backend Aktif</Badge>;
      case 'error':
        return <Badge variant="destructive">Backend Error</Badge>;
      default:
        return null;
    }
  };

  return <div className="text-sm">{getStatusContent()}</div>;
}
