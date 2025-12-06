export interface Flight {
  id: string;
  code: string;
  origin: string;
  destination: string;
  etd: string;
  status: 'BOARDING' | 'TAXIING' | 'IN-AIR' | 'DELAYED';
  capacity: {
    total: number;
    booked: number;
    ghost: number; // The hidden capacity we can sell
    risk: number; // Overbooking threshold
  };
  revenueRecovered: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  message: string;
}

export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface ChatAction {
  label: string;
  type: 'primary' | 'secondary' | 'critical';
  actionId: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  timestamp: string;
  type: 'text' | 'insight';
  content: string;
  actions?: ChatAction[];
  meta?: {
    title?: string;
    profit?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
}

export type ChatSessionMap = Record<string, ChatMessage[]>;
