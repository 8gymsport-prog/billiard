"use client";

import { useState, useEffect } from "react";
import { BilliardTable } from "@/lib/types";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface EditTableDialogProps {
  table: BilliardTable | null;
  onClose: () => void;
}

export function EditTableDialog({ table, onClose }: EditTableDialogProps) {
  const { addTable, updateTable } = useCueKeeper();
  const [name, setName] = useState("");
  
  useEffect(() => {
    setName(table?.name || "");
  }, [table]);

  const isEditing = table !== null;

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEditing) {
      updateTable(table.id, name);
    } else {
      addTable(name);
    }
    onClose();
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit ${table.name}` : "Add New Table"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Change the name of the table below." : "Enter a name for the new table."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Table Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
