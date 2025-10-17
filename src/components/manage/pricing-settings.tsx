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
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <DollarSign className="text-accent" />
            Pricing
        </CardTitle>
        <CardDescription>
            Set the hourly rate for table usage. Current rate: {formatCurrency(settings.hourlyRate)}/hour.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end gap-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="hourly-rate">New Hourly Rate ($)</Label>
          <Input
            type="number"
            id="hourly-rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min="0"
            step="0.5"
          />
        </div>
        <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
        </Button>
      </CardContent>
    </Card>
  );
}
