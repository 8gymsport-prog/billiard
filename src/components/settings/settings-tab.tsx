"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Sun, Moon, BellOff, Bell } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

export function SettingsTab() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const handleNotificationsChange = (enabled: boolean) => {
    // If the user is enabling notifications
    if (enabled) {
      // Check if the Notification API is available in the browser
      if ('Notification' in window) {
        // Request permission from the user
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Optionally, show a test notification
            new Notification('Notifikasi Diaktifkan!', {
              body: 'Anda akan menerima notifikasi dari aplikasi ini.',
            });
          } else {
            console.log('Notification permission denied.');
          }
        });
      }
    }
    // Update the settings state regardless of permission
    updateSettings({ notificationsEnabled: enabled });
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
            <Label htmlFor="notifications-enabled" className="font-semibold">Notifikasi</Label>
            <p className="text-sm text-muted-foreground">Aktifkan atau non-aktifkan semua notifikasi.</p>
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
