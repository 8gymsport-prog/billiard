"use client";

import { HistoryTab } from "@/components/history/history-tab";
import { DashboardTab } from "@/components/dashboard/dashboard-tab";
import { ManageTab } from "@/components/manage/manage-tab";
import { SettingsTab } from "@/components/settings/settings-tab";
import { LiveClock } from "@/components/common/live-clock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dices, LayoutDashboard, List, Settings, History } from "lucide-react";
import { ClientOnly } from "@/components/common/client-only";
import { BackendStatus } from "@/components/common/backend-status";
import { WeatherForecast } from "@/components/common/weather-forecast";

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-4 mb-6">
        <div className="text-primary">
          <Dices size={48} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            8GymSport Billiard
          </h1>
          <p className="text-muted-foreground">Automatic System For Billiard</p>
          <ClientOnly>
            <div className="flex items-center gap-2 flex-wrap">
              <LiveClock />
              <span>&bull;</span>
              <BackendStatus />
              <span>&bull;</span>
              <WeatherForecast />
            </div>
          </ClientOnly>
        </div>
      </header>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="manage">
            <List className="w-4 h-4 mr-2" />
            Kelola
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Riwayat
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </TabsTrigger>
        </TabsList>
        <Card>
          <CardContent className="p-0">
            <TabsContent value="dashboard" className="m-0">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="manage" className="m-0">
              <ManageTab />
            </TabsContent>
            <TabsContent value="history" className="m-0">
              <HistoryTab />
            </TabsContent>
            <TabsContent value="settings" className="m-0">
              <SettingsTab />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}
