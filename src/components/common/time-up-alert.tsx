"use client";

import React, { useState, useEffect } from "react";
import { Session } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface TimeUpAlertProps {
  session: Session;
}

export function TimeUpAlert({ session }: TimeUpAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState("default");

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (session.durationMinutes <= 0 || hasBeenShown) return;

    const checkTime = () => {
      const remainingMinutes = session.durationMinutes - (Date.now() - session.startTime) / (1000 * 60);
      if (remainingMinutes <= 0 && !hasBeenShown) {
        setShowAlert(true);
        setHasBeenShown(true); // Prevent re-triggering
        if (
          typeof window !== 'undefined' &&
          'serviceWorker' in navigator &&
          Notification.permission === "granted"
        ) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("Waktu Habis!", {
              body: `Sesi di ${session.tableName} telah selesai.`,
              icon: "/favicon.ico",
              actions: [
                { action: "extend", title: "Perpanjang Sesi" },
                { action: "dismiss", title: "Tutup" }
              ]
            } as any); // <-- FIX: Add type assertion to bypass TypeScript error
          });
        }
      }
    };

    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [session, hasBeenShown]);

  const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };

  if (!showAlert) {
    return null;
  }

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-destructive text-2xl">Waktu Habis!</AlertDialogTitle>
          <AlertDialogDescription>
            Sesi di <strong>{session.tableName}</strong> telah selesai.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {notificationPermission === "default" && (
          <div className="mt-4">
            <p className="mb-2">Aktifkan notifikasi untuk mendapatkan pengingat interaktif.</p>
            <Button onClick={requestNotificationPermission}>Aktifkan Notifikasi</Button>
          </div>
        )}
        <AlertDialogAction onClick={() => setShowAlert(false)}>Mengerti</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
