"use client";

import { useState } from "react";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { BilliardTable } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Play, Plus, Trash, Dices } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditTableDialog } from "./edit-table-dialog";
import { StartSessionDialog } from "./start-session-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function TableList() {
  const { tables, activeSessions, addTable, removeTable } = useCueKeeper();
  const [editingTable, setEditingTable] = useState<BilliardTable | null>(null);
  const [startingSessionTable, setStartingSessionTable] = useState<BilliardTable | null>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);

  const activeTableIds = new Set(activeSessions.map(s => s.tableId));

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <Dices className="text-accent" />
                    Manajemen Meja
                </CardTitle>
                <CardDescription>Lihat status, mulai sesi, dan konfigurasikan meja Anda.</CardDescription>
            </div>
            <Button onClick={() => setIsAddingTable(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Meja
            </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables.map(table => {
              const isActive = activeTableIds.has(table.id);
              return (
                <div key={table.id} className="p-4 border rounded-lg flex items-center justify-between bg-card">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{table.name}</h3>
                    <Badge variant={isActive ? "destructive" : "secondary"}>
                      {isActive ? "Digunakan" : "Tersedia"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStartingSessionTable(table)}
                      disabled={isActive}
                      aria-label={`Mulai sesi di ${table.name}`}
                    >
                      <Play className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingTable(table)} aria-label={`Edit ${table.name}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" disabled={isActive} aria-label={`Hapus ${table.name}`}>
                            <Trash className="h-4 w-4 text-destructive/70" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ini akan menghapus "{table.name}" secara permanen. Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeTable(table.id)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {(editingTable || isAddingTable) && (
        <EditTableDialog
          table={editingTable}
          onClose={() => {
            setEditingTable(null);
            setIsAddingTable(false);
          }}
        />
      )}
      {startingSessionTable && (
        <StartSessionDialog
          table={startingSessionTable}
          onClose={() => setStartingSessionTable(null)}
        />
      )}
    </>
  );
}
