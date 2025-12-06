import React, { useState, useEffect } from "react";
import {
  Radar,
  Clock,
  Wifi,
  LineChart,
  AlertCircle,
  Scale,
  SlidersHorizontal,
  Edit3,
  Save,
  FileCheck,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Flight, ChatMessage, ChatSessionMap } from "../aeromindTypes";
import {
  INITIAL_FLIGHTS,
  INITIAL_CHAT_SESSIONS,
  CONE_POINTS,
  DEFAULT_WEIGHTS,
  THEME,
} from "../aeromindConstants";
import { FlightCard } from "./FlightCard";
import { RevenueChart } from "./RevenueChart";
import { ChatInterface } from "./ChatInterface";

const AeromindPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [selectedFlightId, setSelectedFlightId] = useState<string>("1"); // Default to first flight
  const [chatSessions, setChatSessions] = useState<ChatSessionMap>(
    INITIAL_CHAT_SESSIONS
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalRevenue, setTotalRevenue] = useState(145000);
  const [hoursToDeparture, setHoursToDeparture] = useState(18);
  const [manualEstimate] = useState(DEFAULT_WEIGHTS.manual);
  const [aiEstimate] = useState(DEFAULT_WEIGHTS.ai);
  const [overrideBuffer, setOverrideBuffer] = useState(300);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideNote, setOverrideNote] = useState<string | null>(null);
  const [isLoadSheetLocked, setIsLoadSheetLocked] = useState(false);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate AI Activity - Pushes new messages to RANDOM flights
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to do nothing
      if (Math.random() > 0.7) return;

      const randomFlight = flights[Math.floor(Math.random() * flights.length)];
      const events: Partial<ChatMessage>[] = [
        {
          type: "text",
          content: `Scanning manifest. Capacity usage nominal.`,
        },
        {
          type: "text",
          content: `Cross-referencing partner airline inventory for route ${randomFlight.origin}-${randomFlight.destination}...`,
        },
        {
          type: "insight",
          content: `Detected variance. ${randomFlight.capacity.ghost}kg available. A partner airline has overbooked cargo on this route.`,
          meta: {
            title: "Ghost Space Match",
            profit: "+$2,400",
            riskLevel: "low",
          },
          actions: [
            {
              label: "View Match Details",
              type: "secondary",
              actionId: `view_${randomFlight.id}`,
            },
            {
              label: "Offer Swap",
              type: "primary",
              actionId: `swap_${randomFlight.id}`,
            },
          ],
        },
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];

      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: randomEvent.type as "text" | "insight",
        content: randomEvent.content!,
        meta: randomEvent.meta,
        actions: randomEvent.actions,
      };

      // Update the specific session for the random flight
      setChatSessions((prev) => ({
        ...prev,
        [randomFlight.id]: [...(prev[randomFlight.id] || []), newMessage],
      }));
    }, 6000); // Check every 6 seconds

    return () => clearInterval(interval);
  }, [flights]);

  const handleSendMessage = (text: string) => {
    if (!selectedFlightId) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      content: text,
    };

    // 1. Add User Message
    setChatSessions((prev) => ({
      ...prev,
      [selectedFlightId]: [...(prev[selectedFlightId] || []), userMsg],
    }));

    // 2. Fake AI Response after delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        content: `Acknowledged. Processing request for flight ${
          flights.find((f) => f.id === selectedFlightId)?.code
        }... Analysis complete.`,
      };

      setChatSessions((prev) => ({
        ...prev,
        [selectedFlightId]: [...(prev[selectedFlightId] || []), aiResponse],
      }));
    }, 1500);
  };

  const handleActionClick = (actionId: string, label: string) => {
    if (!selectedFlightId) return;

    // Add user action to log
    setChatSessions((prev) => ({
      ...prev,
      [selectedFlightId]: [
        ...(prev[selectedFlightId] || []),
        {
          id: Date.now(),
          sender: "user",
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "text",
          content: `AUTHORIZE: ${label}`,
        },
      ],
    }));

    // Simulate system response
    setTimeout(() => {
      setChatSessions((prev) => ({
        ...prev,
        [selectedFlightId]: [
          ...(prev[selectedFlightId] || []),
          {
            id: Date.now() + 1,
            sender: "ai",
            timestamp: new Date().toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "text",
            content: `Protocol "${label}" initiated successfully. Revenue projection updated.`,
          },
        ],
      }));
      setTotalRevenue((prev) => prev + 2400);
    }, 1000);
  };

  const sortedConePoints = [...CONE_POINTS].sort((a, b) => b.hours - a.hours);
  const clampHours = Math.min(Math.max(hoursToDeparture, 0), 24);

  const getConeSnapshot = (targetHours: number) => {
    if (targetHours >= sortedConePoints[0].hours) return sortedConePoints[0];
    if (targetHours <= sortedConePoints[sortedConePoints.length - 1].hours)
      return sortedConePoints[sortedConePoints.length - 1];

    const idx = sortedConePoints.findIndex(
      (p, i) =>
        sortedConePoints[i + 1] &&
        p.hours >= targetHours &&
        sortedConePoints[i + 1].hours <= targetHours
    );

    const upper = sortedConePoints[idx];
    const lower = sortedConePoints[idx + 1];
    const ratio = (upper.hours - targetHours) / (upper.hours - lower.hours);

    return {
      hours: targetHours,
      lower: upper.lower + (lower.lower - upper.lower) * ratio,
      upper: upper.upper + (lower.upper - upper.upper) * ratio,
    };
  };

  const coneSnapshot = getConeSnapshot(clampHours);
  const coneWidth = Math.round(coneSnapshot.upper - coneSnapshot.lower);
  const confidenceLevel =
    coneWidth > 2000 ? "LOW" : coneWidth > 1400 ? "MEDIUM" : "HIGH";
  const recommendedWait =
    confidenceLevel === "LOW" ? 2 : confidenceLevel === "MEDIUM" ? 1 : 0;

  const minWeight = Math.min(...sortedConePoints.map((p) => p.lower));
  const maxWeight = Math.max(...sortedConePoints.map((p) => p.upper));
  const weightSpan = maxWeight - minWeight || 1;

  const polygonPoints = [
    ...sortedConePoints.map((p) => {
      const x = ((24 - p.hours) / 24) * 100;
      const y = 100 - ((p.upper - minWeight) / weightSpan) * 100;
      return `${x},${y}`;
    }),
    ...[...sortedConePoints].reverse().map((p) => {
      const x = ((24 - p.hours) / 24) * 100;
      const y = 100 - ((p.lower - minWeight) / weightSpan) * 100;
      return `${x},${y}`;
    }),
  ].join(" ");

  const midLinePoints = sortedConePoints
    .map((p) => {
      const x = ((24 - p.hours) / 24) * 100;
      const mid = (p.lower + p.upper) / 2;
      const y = 100 - ((mid - minWeight) / weightSpan) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const nowXPercent = ((24 - clampHours) / 24) * 100;
  const adjustedAi = aiEstimate + overrideBuffer;
  const delta = adjustedAi - manualEstimate;
  const deltaPct = (delta / manualEstimate) * 100;

  const formatKg = (value: number) => `${Math.round(value).toLocaleString()}kg`;

  const handleApplyOverride = () => {
    if (!overrideReason) return;
    setOverrideNote(
      `Override saved: +${overrideBuffer}kg buffer (${overrideReason}).`
    );
  };

  const handleFinalizeLoadSheet = () => {
    setIsLoadSheetLocked(true);
  };

  const currentMessages = selectedFlightId
    ? chatSessions[selectedFlightId] || []
    : [];
  const currentFlight = flights.find((f) => f.id === selectedFlightId);

  return (
    <div className="h-full bg-zinc-950 text-zinc-200 font-sans selection:bg-white selection:text-black overflow-hidden flex flex-col">
      {/* Background Grid - Subtle Dot Matrix */}
      <div
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* TOP HUD HEADER */}
      <header className="relative z-10 h-16 border-b border-zinc-800 bg-zinc-950/95 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center">
            <Radar className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-widest text-white">
              AEROMIND{" "}
              <span className="text-zinc-500 text-sm align-top">V2.4</span>
            </h1>
            <p className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
              Autonomous Revenue Optimization
            </p>
          </div>
        </div>

        {/* HUD Metrics */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 border-r border-zinc-800 pr-8">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="font-mono text-xl text-white tracking-widest">
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}{" "}
              <span className="text-xs text-zinc-500">UTC</span>
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Revenue Recovered
            </span>
            <span className="font-display text-2xl font-bold text-orange-500 tabular-nums">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 relative z-10 grid grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT PANEL: FLIGHT MONITOR (70%) */}
        <section className="col-span-8 flex flex-col border-r border-zinc-800 bg-zinc-950 p-6 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-end mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-lg text-white uppercase tracking-widest">
                Global Flight Monitor
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono">
                {flights.length} LIVE
              </span>
            </div>

            <div className="flex gap-1">
              {["ALL", "CRITICAL", "OPPORTUNITY"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-1 text-xs font-mono border transition-all ${
                    i === 0
                      ? "bg-orange-500 border-orange-500 text-black font-bold"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600 bg-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Flight List Container */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 scrollbar-thin scrollbar-thumb-zinc-700">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                isSelected={flight.id === selectedFlightId}
                onClick={() => setSelectedFlightId(flight.id)}
              />
            ))}
          </div>

          {/* Bottom status bar for left panel */}
          <div className="h-10 mt-auto border-t border-zinc-800 pt-4 flex items-center justify-between text-xs font-mono text-zinc-600 shrink-0">
            <span>SYSTEM STATUS: NORMAL</span>
            <span className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-zinc-400" /> CONNECTION SECURE
            </span>
          </div>
        </section>

        {/* RIGHT PANEL: CHAT / AGENT INTERFACE (30%) */}
        <section className="col-span-4 flex flex-col bg-zinc-950 border-l border-zinc-800 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,1)] h-full overflow-hidden">
          {/* Revenue Sparkline (Preserved as a header widget) */}
          <div className="p-1 border-b border-zinc-800 bg-zinc-900/50 h-32 shrink-0">
            <RevenueChart />
          </div>

          {/* Conversational Interface */}
          <div className="flex-1 min-h-0 flex flex-col relative">
            <ChatInterface
              messages={currentMessages}
              selectedFlight={currentFlight}
              onSendMessage={handleSendMessage}
              onActionClick={handleActionClick}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AeromindPage;
