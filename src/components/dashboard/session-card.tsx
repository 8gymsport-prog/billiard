"use client";

import React, { useState, useEffect } from "react";
import { Session } from "@/lib/types";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Tag, XCircle } from "lucide-react";
import { EndSessionDialog } from "../common/end-session-dialog";

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const { settings } = useCueKeeper();
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [isEndSessionOpen, setIsEndSessionOpen] = useState(false);

  useEffect(() => {
    const calculateElapsed = () => {
      const elapsed = (Date.now() - session.startTime) / (1000 * 60);
      setElapsedMinutes(elapsed);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [session.startTime]);

  const currentCost = (elapsedMinutes / 60) * settings.hourlyRate;
  const remainingMinutes = session.durationMinutes - elapsedMinutes;

  const isTimeUp = session.durationMinutes > 0 && remainingMinutes <= 0;

  return (
    <>
      <Card className={`flex flex-col shadow-lg transition-all duration-300 ${isTimeUp ? 'border-destructive ring-2 ring-destructive/50' : 'border-primary/20'}`}>
        <CardHeader>
          <CardTitle className="text-primary font-headline text-lg">{session.tableName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-5 h-5 text-accent" />
            <div>
              <div className="font-bold text-foreground">
                {session.durationMinutes > 0
                  ? isTimeUp
                    ? `Time Up! (+${formatDuration(elapsedMinutes - session.durationMinutes)})`
                    : `${formatDuration(remainingMinutes)} left`
                  : `${formatDuration(elapsedMinutes)} elapsed`}
              </div>
              <div className="text-xs">
                {session.durationMinutes > 0 ? `of ${formatDuration(session.durationMinutes)}` : "Open-ended session"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Tag className="w-5 h-5 text-accent" />
            <div>
              <div className="font-bold text-foreground">{formatCurrency(currentCost)}</div>
              <div className="text-xs">Current cost</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={() => setIsEndSessionOpen(true)}>
            <XCircle className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </CardFooter>
      </Card>
      {isEndSessionOpen && <EndSessionDialog session={session} cost={currentCost} onClose={() => setIsEndSessionOpen(false)} />}
    </>
  );
}
