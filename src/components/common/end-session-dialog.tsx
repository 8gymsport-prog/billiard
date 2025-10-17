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
            title: "Session Ended",
            description: `${finalSession.tableName} session finished. Final cost: ${formatCurrency(finalSession.cost || 0)}`,
        });
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Session for {session.tableName}?</DialogTitle>
          <DialogDescription>
            This will stop the timer and calculate the final cost.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 text-center">
            <p className="text-muted-foreground">Final Cost</p>
            <p className="text-4xl font-bold font-headline text-primary">{formatCurrency(cost)}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleEndSession}>Confirm & End</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
