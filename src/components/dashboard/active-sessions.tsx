"use client";

import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { SessionCard } from "./session-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { TimeUpAlert } from "../common/time-up-alert";

export function ActiveSessions() {
  const { activeSessions, endSession } = useCueKeeper();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <Hourglass className="text-accent" />
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeSessions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeSessions.map((session) => (
              <>
                <SessionCard key={session.id} session={session} />
                {session.durationMinutes > 0 && <TimeUpAlert session={session} />}
              </>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No tables are currently in use.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
