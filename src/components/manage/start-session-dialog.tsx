"use client";

import { useState } from "react";
import { BilliardTable } from "@/lib/types";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Play } from "lucide-react";

interface StartSessionDialogProps {
  table: BilliardTable;
  onClose: () => void;
}

export function StartSessionDialog({ table, onClose }: StartSessionDialogProps) {
  const { startSession } = useCueKeeper();
  const { toast } = useToast();
  const [duration, setDuration] = useState(60); // Default to 1 hour

  const handleStart = () => {
    startSession(table.id, duration);
    toast({
      title: "Session Started",
      description: `Session on ${table.name} has begun.`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Session on {table.name}</DialogTitle>
          <DialogDescription>
            Enter the session duration in minutes. Use 0 for an open-ended session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (mins)
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="col-span-3"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleStart}>
            <Play className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
