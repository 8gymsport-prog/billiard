"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Sun, Moon, BellOff, Bell } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { useToast } from '@/hooks/use-toast';

async function subscribeToPushNotifications() {
    try {
        const swRegistration = await navigator.serviceWorker.ready;
        let subscription = await swRegistration.pushManager.getSubscription();

        if (!subscription) {
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                console.error("VAPID public key not found in environment variables.");
                return null;
            }
            subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey,
            });
        }
        
        const response = await fetch("/api/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'subscribe', subscription }),
        });

        if (!response.ok) {
            console.error("Failed to subscribe on server:", await response.text());
            return null;
        }

        return subscription;

    } catch (error) {
        console.error("Failed to subscribe to push notifications", error);
        return null;
    }
}


export function SettingsTab() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  const handleNotificationsChange = async (enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled });

    if (enabled) {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const currentPermission = Notification.permission;
        if (currentPermission === 'granted') {
          toast({ title: 'Notifikasi sudah diaktifkan.' });
          await subscribeToPushNotifications();
        } else if (currentPermission !== 'denied') {
          const newPermission = await Notification.requestPermission();
          if (newPermission === 'granted') {
            toast({ title: 'Notifikasi Diaktifkan!', description: 'Anda akan menerima pemberitahuan dari aplikasi.' });
            await subscribeToPushNotifications();
          } else {
            toast({ variant: 'destructive', title: 'Izin Ditolak', description: 'Anda tidak akan menerima notifikasi.' });
            updateSettings({ notificationsEnabled: false }); // Revert setting if denied
          }
        } else { // Permission is denied
             toast({ variant: 'destructive', title: 'Notifikasi Diblokir', description: 'Harap aktifkan notifikasi di pengaturan browser Anda.' });
             updateSettings({ notificationsEnabled: false }); // Revert setting
        }
      } else {
        toast({ variant: 'destructive', title: 'Browser Tidak Didukung', description: 'Browser Anda tidak mendukung notifikasi push.' });
        updateSettings({ notificationsEnabled: false }); // Revert setting
      }
    } else {
       toast({ title: 'Notifikasi Dinonaktifkan.' });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Pengaturan</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label htmlFor="theme-switcher" className="font-semibold">Ganti Tema</Label>
            <p className="text-sm text-muted-foreground">Pilih antara tema terang atau gelap.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme('light')} className={`p-2 rounded-md ${theme === 'light' ? 'bg-accent' : ''}`}><Sun size={18} /></button>
            <button onClick={() => setTheme('dark')} className={`p-2 rounded-md ${theme === 'dark' ? 'bg-accent' : ''}`}><Moon size={18} /></button>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label htmlFor="notifications-enabled" className="font-semibold">Notifikasi Push</Label>
            <p className="text-sm text-muted-foreground">Terima notifikasi saat waktu sesi habis.</p>
          </div>
          <div className="flex items-center gap-2">
             {settings.notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            <Switch
              id="notifications-enabled"
              checked={settings.notificationsEnabled}
              onCheckedChange={handleNotificationsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
