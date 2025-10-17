"use client";

import React, { useState, useEffect, useRef } from "react";
import { Session } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TimeUpAlertProps {
  session: Session;
}

const notificationSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

export function TimeUpAlert({ session }: TimeUpAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkTime = () => {
      // Pastikan sesi memiliki durasi yang ditentukan
      if (session.durationMinutes <= 0 || hasBeenShown) return;

      const elapsedMinutes = (Date.now() - session.startTime) / (1000 * 60);
      if (elapsedMinutes >= session.durationMinutes && !hasBeenShown) {
        setShowAlert(true);
        setHasBeenShown(true); // Mencegah pemicuan ulang
        
        // Coba putar audio
        audioRef.current?.play().catch(e => console.error("Gagal memutar audio:", e));
      }
    };

    // Periksa waktu setiap detik
    const interval = setInterval(checkTime, 1000);

    // Bersihkan interval saat komponen dilepas
    return () => clearInterval(interval);
  }, [session.startTime, session.durationMinutes, hasBeenShown]);

  if (!showAlert) {
    // Tetap render elemen audio agar siap, tetapi sembunyikan
    return (
      <audio ref={audioRef} src={notificationSound} preload="auto" className="hidden" />
    );
  }

  return (
    <>
      <audio ref={audioRef} src={notificationSound} preload="auto" className="hidden" />
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
    </>
  );
}
