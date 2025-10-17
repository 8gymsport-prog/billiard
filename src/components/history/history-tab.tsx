"use client";

import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function HistoryTab() {
  const { finishedSessions } = useCueKeeper();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = finishedSessions.filter(session => 
    session.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-headline text-primary mb-4">Riwayat Sesi</h2>
       <Input
        placeholder="Filter berdasarkan nama meja..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-4"
      />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meja</TableHead>
              <TableHead>Waktu Mulai</TableHead>
              <TableHead>Waktu Selesai</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead className="text-right">Biaya</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <Badge variant="outline">{session.tableName}</Badge>
                  </TableCell>
                  <TableCell>{new Date(session.startTime).toLocaleString()}</TableCell>
                  <TableCell>{session.endTime ? new Date(session.endTime).toLocaleString() : "-"}</TableCell>
                  <TableCell>
                    {formatDuration(
                      session.endTime ? (session.endTime - session.startTime) / (1000 * 60) : 0
                    )}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(session.cost || 0)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada sesi yang selesai ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
