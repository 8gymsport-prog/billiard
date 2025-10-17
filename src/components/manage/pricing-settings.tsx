"use client";

import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DollarSign, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function PricingSettings() {
  const { settings, updateSettings } = useCueKeeper();
  const [rate, setRate] = useState(settings.hourlyRate);

  const handleSave = () => {
    updateSettings({ hourlyRate: Number(rate) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline font-semibold">
            <DollarSign className="text-accent" />
            Harga
        </CardTitle>
        <CardDescription>
            Atur tarif per jam untuk penggunaan meja. Tarif saat ini: {formatCurrency(settings.hourlyRate)}/jam.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end gap-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="hourly-rate">Tarif Per Jam Baru (Rp)</Label>
          <Input
            type="number"
            id="hourly-rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min="0"
            step="500"
          />
        </div>
        <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Simpan
        </Button>
      </CardContent>
    </Card>
  );
}
