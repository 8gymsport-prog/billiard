import { ActiveSessions } from "./active-sessions";
import { AIAnalyst } from "./ai-analyst";
import { RevenueOverview } from "./revenue-overview";

export function DashboardTab() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <ActiveSessions />
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueOverview />
        <AIAnalyst />
      </div>
    </div>
  );
}
