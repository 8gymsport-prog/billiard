"use client";

import { useState } from "react";
import { predictTableOccupancy, PredictTableOccupancyOutput } from "@/ai/flows/predict-table-occupancy";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function OccupancyPrediction() {
  const { finishedSessions } = useCueKeeper();
  const [prediction, setPrediction] = useState<PredictTableOccupancyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const historicalData = finishedSessions
      .map(s => `Table: ${s.tableName}, Start: ${new Date(s.startTime).toLocaleString()}, End: ${s.endTime ? new Date(s.endTime).toLocaleString() : 'N/A'}, Duration: ${Math.round((s.endTime ?? s.startTime) - s.startTime / (60 * 1000))} mins`)
      .join('\n');

    if (finishedSessions.length < 1) {
      setError("Not enough historical data to make a prediction. Complete at least one session.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await predictTableOccupancy({ historicalData });
      setPrediction(result);
    } catch (e) {
      console.error(e);
      setError("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getOccupancyBadgeVariant = (occupancy: number): "default" | "secondary" | "destructive" => {
    if (occupancy > 0.7) return "destructive";
    if (occupancy > 0.4) return "default";
    return "secondary";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <BrainCircuit className="text-accent" />
          AI Occupancy Prediction
        </CardTitle>
        <CardDescription>Predict which tables will be popular based on historical data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handlePredict} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Predict Popular Tables
            </>
          )}
        </Button>
        {isLoading && <Progress value={33} className="w-full animate-pulse" />}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {prediction && (
          <div className="space-y-3 pt-4">
            {prediction.tablePredictions.sort((a,b) => b.predictedOccupancy - a.predictedOccupancy).map((p) => (
              <div key={p.tableId} className="p-3 rounded-lg border bg-background/50">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">{p.tableId}</h4>
                  <Badge variant={getOccupancyBadgeVariant(p.predictedOccupancy)}>
                    {`${(p.predictedOccupancy * 100).toFixed(0)}% busy`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{p.reason}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
