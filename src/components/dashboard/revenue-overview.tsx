"use client";

import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";

export function RevenueOverview() {
  const { finishedSessions, tables } = useCueKeeper();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { chartData, totalRevenue } = useMemo(() => {
    const revenueByTable = new Map<string, number>();

    finishedSessions.forEach(session => {
      if (session.cost) {
        revenueByTable.set(session.tableId, (revenueByTable.get(session.tableId) || 0) + session.cost);
      }
    });

    const chartData = tables.map(table => ({
      name: table.name,
      total: revenueByTable.get(table.id) || 0,
    })).sort((a,b) => b.total - a.total);

    const totalRevenue = Array.from(revenueByTable.values()).reduce((sum, cost) => sum + cost, 0);

    return { chartData, totalRevenue };
  }, [finishedSessions, tables]);
  
  if (!isClient) {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline font-semibold">
              <DollarSign className="text-accent" />
              Ringkasan Pendapatan
            </CardTitle>
            <CardDescription>Memuat data pendapatan...</CardDescription>
          </CardHeader>
          <CardContent>
           <div className="h-[300px] flex items-center justify-center text-muted-foreground">
             <p>Memuat...</p>
           </div>
          </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline font-semibold">
          <DollarSign className="text-accent" />
          Ringkasan Pendapatan
        </CardTitle>
        <CardDescription>Total Pendapatan: {formatCurrency(totalRevenue)}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number) => formatCurrency(value)}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
           <div className="h-[300px] flex items-center justify-center text-muted-foreground">
             <p>Belum ada data pendapatan. Selesaikan sesi untuk melihat hasilnya.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
