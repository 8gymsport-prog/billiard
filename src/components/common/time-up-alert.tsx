"use client";

import React, { useState, useEffect, useRef } from "react";
import { Session } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TimeUpAlertProps {
  session: Session;
}

// Data URI untuk file WAV 1 detik (nada sederhana)
const notificationSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

export function TimeUpAlert({ session }: TimeUpAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(notificationSound);
    }
  }, []);

  useEffect(() => {
    if (session.durationMinutes <= 0 || hasBeenShown) return;

    const checkTime = () => {
      const remainingMinutes = session.durationMinutes - (Date.now() - session.startTime) / (1000 * 60);
      if (remainingMinutes <= 0 && !hasBeenShown) {
        setShowAlert(true);
        setHasBeenShown(true); // Prevent re-triggering
        audioRef.current?.play().catch(e => console.error("Gagal memutar audio:", e));
      }
    };

    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [session, hasBeenShown]);

  if (!showAlert) {
    return null;
  }

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline font-bold text-destructive text-2xl">Waktu Habis!</AlertDialogTitle>
          <AlertDialogDescription>
            Sesi di <strong>{session.tableName}</strong> telah selesai.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={() => setShowAlert(false)}>Mengerti</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
