"use client";

import { useState, useMemo } from "react";
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
      title: "Sesi Dimulai",
      description: `Sesi di ${table.name} telah dimulai.`,
    });
    onClose();
  };

  const endTime = useMemo(() => {
    if (duration <= 0) {
      return "Sesi tanpa batas waktu";
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() + duration);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [duration]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mulai Sesi di {table.name}</DialogTitle>
          <DialogDescription>
            Masukkan durasi sesi dalam menit. Gunakan 0 untuk sesi tanpa batas waktu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Durasi (menit)
            </Label>
            <Input
              id="duration"
              type="text"
              inputMode="numeric"
              value={duration}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setDuration(Number(numericValue));
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3 text-sm text-muted-foreground">
                Perkiraan waktu selesai: <strong>{endTime}</strong>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" onClick={handleStart}>
            <Play className="w-4 h-4 mr-2" />
            Mulai Sesi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
