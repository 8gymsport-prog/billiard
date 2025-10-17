"use client";

import { Session } from "@/lib/types";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EndSessionDialogProps {
  session: Session;
  cost: number;
  onClose: () => void;
}

export function EndSessionDialog({ session, cost, onClose }: EndSessionDialogProps) {
  const { endSession } = useCueKeeper();
  const { toast } = useToast();

  const handleEndSession = () => {
    const finalSession = endSession(session.id);
    if(finalSession) {
        toast({
            title: "Sesi Selesai",
            description: `Sesi ${finalSession.tableName} selesai. Biaya akhir: ${formatCurrency(finalSession.cost || 0)}`,
        });
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Akhiri Sesi untuk {session.tableName}?</DialogTitle>
          <DialogDescription>
            Ini akan menghentikan timer dan menghitung biaya akhir.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 text-center">
            <p className="text-muted-foreground">Biaya Akhir</p>
            <p className="text-4xl font-bold font-headline text-primary">{formatCurrency(cost)}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="destructive" onClick={handleEndSession}>Konfirmasi & Akhiri</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
