
import { useEffect } from 'react';
import { useCueKeeper } from '@/hooks/use-cue-keeper';

export function useSessionWatcher() {
  const { activeSessions, getTableById, settings } = useCueKeeper();

  useEffect(() => {
    const checkSessions = () => {
      activeSessions.forEach(session => {
        if (session.durationMinutes > 0) {
          const endTime = session.startTime + session.durationMinutes * 60 * 1000;
          if (Date.now() >= endTime) {
            if (settings.notificationsEnabled && 'serviceWorker' in navigator && Notification.permission === 'granted') {
              navigator.serviceWorker.ready.then(registration => {
                const table = getTableById(session.tableId);
                registration.showNotification('Waktu Habis!', {
                  body: `Sesi di ${table ? table.name : 'sebuah meja'} telah selesai.`,
                  icon: '/favicon.ico',
                  tag: session.id,
                  actions: [
                    { action: 'extend', title: 'Perpanjang Sesi' },
                    { action: 'dismiss', title: 'Tutup' }
                  ]
                });
              });
            }
          }
        }
      });
    };

    const intervalId = setInterval(checkSessions, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [activeSessions, getTableById, settings.notificationsEnabled]);
}
