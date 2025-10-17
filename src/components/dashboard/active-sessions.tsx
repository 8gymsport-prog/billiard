"use client";

import React from "react";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { SessionCard } from "./session-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { TimeUpAlert } from "../common/time-up-alert";

export function ActiveSessions() {
  const { activeSessions } = useCueKeeper();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline font-semibold">
          <Hourglass className="text-accent" />
          Sesi Aktif
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeSessions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeSessions.map((session) => (
              <React.Fragment key={session.id}>
                <SessionCard session={session} />
                {session.durationMinutes > 0 && <TimeUpAlert session={session} />}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Saat ini tidak ada meja yang digunakan.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
