export interface BilliardTable {
  id: string;
  name: string;
}

export type SessionStatus = "active" | "finished";

export interface Session {
  id: string;
  tableId: string;
  tableName: string;
  startTime: number; // Unix timestamp ms
  endTime?: number; // Unix timestamp ms
  durationMinutes: number; // 0 for open-ended
  cost?: number;
  status: SessionStatus;
}

export interface AppSettings {
  hourlyRate: number;
}
