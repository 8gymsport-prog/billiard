"use client";

import { HistoryTab } from "@/components/history/history-tab";
import { DashboardTab } from "@/components/dashboard/dashboard-tab";
import { ManageTab } from "@/components/manage/manage-tab";
// import { Logo } from "@/components/icons/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dices, LayoutDashboard, List, Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-4 mb-6">
        <div className="text-primary">
          <Dices size={48} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-headline text-primary">
            8GymSport Billiard
          </h1>
          <p className="text-muted-foreground">Automatic System For Billiard</p>
        </div>
      </header>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dasboard
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Settings className="w-4 h-4 mr-2" />
            Kelola
          </TabsTrigger>
          <TabsTrigger value="history">
            <List className="w-4 h-4 mr-2" />
            Riwayat
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
          </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}
