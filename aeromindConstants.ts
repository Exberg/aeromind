import { Flight, LogEntry, ChatSessionMap } from './aeromindTypes';

export const THEME = {
  accent: "orange-500",
  accentHex: "#f97316",
  accentClass: "text-orange-500",
  accentBgClass: "bg-orange-500",
  accentBorderClass: "border-orange-500",
};

export const DEFAULT_WEIGHTS = {
  manual: 18500,
  ai: 16200,
};

export const CONE_POINTS = [
  { hours: 24, lower: 15000, upper: 21500 },
  { hours: 18, lower: 15500, upper: 20500 },
  { hours: 12, lower: 15800, upper: 19800 },
  { hours: 8, lower: 16000, upper: 19000 },
  { hours: 4, lower: 16150, upper: 17800 },
  { hours: 2, lower: 16200, upper: 17200 },
  { hours: 1, lower: 16200, upper: 16850 },
  { hours: 0, lower: 16200, upper: 16550 },
];

export const INITIAL_FLIGHTS: Flight[] = [
  {
    id: '1',
    code: 'AERO-772',
    origin: 'KUL',
    destination: 'LHR',
    etd: '14:00',
    status: 'BOARDING',
    capacity: { total: 12000, booked: 7500, ghost: 3500, risk: 1000 },
    revenueRecovered: 12450
  },
  {
    id: '2',
    code: 'AERO-091',
    origin: 'JFK',
    destination: 'HND',
    etd: '14:45',
    status: 'IN-AIR',
    capacity: { total: 18000, booked: 16000, ghost: 1200, risk: 800 },
    revenueRecovered: 4500
  },
  {
    id: '3',
    code: 'AERO-442',
    origin: 'SIN',
    destination: 'DXB',
    etd: '15:10',
    status: 'TAXIING',
    capacity: { total: 10000, booked: 4000, ghost: 5500, risk: 500 },
    revenueRecovered: 8200
  },
  {
    id: '4',
    code: 'AERO-881',
    origin: 'LAX',
    destination: 'SYD',
    etd: '16:00',
    status: 'BOARDING',
    capacity: { total: 15000, booked: 11000, ghost: 3000, risk: 1000 },
    revenueRecovered: 0
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 1, timestamp: '13:58:01', level: 'INFO', message: 'SYSTEM INITIALIZED. SCANNING MANIFESTS.' },
  { id: 2, timestamp: '13:58:04', level: 'INFO', message: 'CONNECTED TO GLOBAL DISTRIBUTION SYSTEM.' },
  { id: 3, timestamp: '13:58:12', level: 'WARNING', message: 'FLIGHT AERO-442: 5500KG GHOST CAPACITY DETECTED.' },
];

export const INITIAL_CHAT_SESSIONS: ChatSessionMap = {
  '1': [
    {
      id: 1,
      sender: 'ai',
      timestamp: '14:02',
      type: 'text',
      content: 'Connected to Flight AERO-772 (KUL->LHR). Monitoring boarding status.'
    },
    {
      id: 2,
      sender: 'ai',
      timestamp: '14:05',
      type: 'insight',
      content: 'Gate agents report 3500kg under-utilization. I found a pending request from Royal Mail for 2000kg.',
      meta: { title: 'Cargo Opportunity', profit: '+$8,200', riskLevel: 'low' },
      actions: [
        { label: 'Review Contract', type: 'secondary', actionId: 'review_772' },
        { label: 'Accept Cargo', type: 'primary', actionId: 'accept_772' }
      ]
    }
  ],
  '2': [
    {
      id: 1,
      sender: 'ai',
      timestamp: '13:45',
      type: 'text',
      content: 'Flight AERO-091 is airborne. Telemetry stable. Revenue optimization window closing soon.'
    }
  ],
  '3': [
    {
      id: 1,
      sender: 'ai',
      timestamp: '14:10',
      type: 'text',
      content: 'Flight AERO-442 initializing. Heavy ghost capacity detected (5500kg).'
    },
    {
      id: 2,
      sender: 'user',
      timestamp: '14:12',
      type: 'text',
      content: 'Find me a buyer for the Singapore route.'
    },
    {
      id: 3,
      sender: 'ai',
      timestamp: '14:12',
      type: 'insight',
      content: 'Negotiating with DHL Logistics hub in Changi. They can take 4000kg immediately.',
      meta: { title: 'Bulk Offer', profit: '+$12,450', riskLevel: 'medium' },
      actions: [
        { label: 'Confirm Deal', type: 'primary', actionId: 'confirm_442' }
      ]
    }
  ],
  '4': [
    {
      id: 1,
      sender: 'ai',
      timestamp: '14:00',
      type: 'text',
      content: 'AERO-881 LAX->SYD. No significant variance detected yet.'
    }
  ]
};
