"use client";

import React, { useState, useEffect } from "react";
import { Session } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TimeUpAlertProps {
  session: Session;
}

export function TimeUpAlert({ session }: TimeUpAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    if (session.durationMinutes <= 0 || hasBeenShown) return;

    const checkTime = () => {
      const remainingMinutes = session.durationMinutes - (Date.now() - session.startTime) / (1000 * 60);
      if (remainingMinutes <= 0 && !hasBeenShown) {
        setShowAlert(true);
        setHasBeenShown(true); // Prevent re-triggering
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
          <AlertDialogTitle className="font-headline text-destructive text-2xl">Time's Up!</AlertDialogTitle>
          <AlertDialogDescription>
            The session on <strong>{session.tableName}</strong> has finished.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={() => setShowAlert(false)}>Acknowledge</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
