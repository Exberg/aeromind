import React, { useState, useEffect, useRef } from "react";
import {
  Radar,
  Clock,
  Wifi,
  LineChart,
  AlertCircle,
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

const OVERRIDE_REASON_OPTIONS = [
  "Visual confirmation of heavy equipment",
  "Sports charter just boarded",
  "Maintenance/ballast adjustment",
  "Manual manifest discrepancy",
  "Other human signal",
];

const formatKg = (value: number) => `${Math.round(value).toLocaleString()}kg`;

const AeromindPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [selectedFlightId, setSelectedFlightId] = useState<string>("1");
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
  const [operationStatus, setOperationStatus] = useState<
    "OPTIMIZING" | "CLOSED"
  >("OPTIMIZING");
  const [showStamp, setShowStamp] = useState(false);
  const [overrideHighlight, setOverrideHighlight] = useState(false);
  const overrideCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
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

      setChatSessions((prev) => ({
        ...prev,
        [randomFlight.id]: [...(prev[randomFlight.id] || []), newMessage],
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, [flights]);

  useEffect(() => {
    if (!overrideHighlight) return;
    const timer = setTimeout(() => setOverrideHighlight(false), 1200);
    return () => clearTimeout(timer);
  }, [overrideHighlight]);

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

    setChatSessions((prev) => ({
      ...prev,
      [selectedFlightId]: [...(prev[selectedFlightId] || []), userMsg],
    }));

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
  const loadSheetWindowOpen = clampHours <= 0.5;

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
  const deltaPct = manualEstimate
    ? (delta / manualEstimate) * 100
    : 0;
  const deltaIsLighter = delta < 0;
  const deltaBadgeClasses = deltaIsLighter
    ? "bg-emerald-500/90 text-emerald-950"
    : "bg-red-500/90 text-red-950";
  const deltaCaption = `${deltaIsLighter ? "Opportunity" : "Risk"}: ${Math.abs(
    deltaPct
  ).toFixed(1)}% ${deltaIsLighter ? "lighter" : "heavier"}`;

  const handleApplyOverride = () => {
    if (!overrideReason || isLoadSheetLocked) return;
    setOverrideNote(
      `Override saved: +${overrideBuffer}kg buffer (${overrideReason}).`
    );
  };

  const handleJumpToOverride = () => {
    overrideCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setOverrideHighlight(true);
  };

  const handleFinalizeLoadSheet = () => {
    if (isLoadSheetLocked) return;
    setIsLoadSheetLocked(true);
    setOperationStatus("CLOSED");
    setShowStamp(true);
    setTimeout(() => setShowStamp(false), 1600);
  };

  const currentMessages = selectedFlightId
    ? chatSessions[selectedFlightId] || []
    : [];
  const currentFlight = flights.find((f) => f.id === selectedFlightId);

  return (
    <div className="h-full bg-zinc-950 text-zinc-200 font-sans selection:bg-white selection:text-black overflow-hidden flex flex-col">
      <div
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <header className="relative z-10 h-16 border-b border-zinc-800 bg-zinc-950/95 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center">
            <Radar className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-widest text-white">
              AEROMIND <span className="text-zinc-500 text-sm align-top">V2.4</span>
            </h1>
            <p className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
              Autonomous Revenue Optimization
            </p>
          </div>
        </div>

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

      <main className="flex-1 relative z-10 grid grid-cols-12 gap-0 overflow-hidden">
        <section className="col-span-12 border-b border-zinc-900 bg-zinc-950/80 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Ops Status
              </p>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-widest border ${
                  operationStatus === "CLOSED"
                    ? "border-red-500/40 text-red-300 bg-red-500/10"
                    : "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                }`}
              >
                {operationStatus}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Departure Horizon
              </p>
              <p className="font-mono text-2xl text-white">
                T-{clampHours.toFixed(1)}h
                <span className="text-xs text-zinc-500 ml-2">
                  Cone confidence {confidenceLevel}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-7">
              <div className="border border-zinc-800 bg-zinc-950 p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <LineChart className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-400">
                        Cone of Uncertainty
                      </p>
                      <p className="text-sm text-zinc-500">
                        Confidence interval for payload prediction
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-500">
                    <p>Window: T-24h → T-0h</p>
                    <p>Current Spread: {formatKg(coneSnapshot.lower)} - {formatKg(coneSnapshot.upper)}</p>
                  </div>
                </div>

                <div className="mt-4 relative w-full aspect-[16/9] bg-black/40 border border-zinc-900">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="coneGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={THEME.accentHex} stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <polygon
                      points={polygonPoints}
                      fill="url(#coneGradient)"
                      stroke={THEME.accentHex}
                      strokeOpacity={0.3}
                      strokeWidth={0.4}
                    />
                    <polyline
                      points={midLinePoints}
                      fill="none"
                      stroke="#ffffff"
                      strokeOpacity={0.7}
                      strokeWidth={0.6}
                      strokeDasharray="4 2"
                    />
                    <line
                      x1={nowXPercent}
                      y1={0}
                      x2={nowXPercent}
                      y2={100}
                      stroke="#ffffff"
                      strokeWidth={0.6}
                      strokeDasharray="2 2"
                    />
                  </svg>
                  <div className="absolute left-2 top-2 text-[10px] text-zinc-500">
                    Weight (kg)
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] text-zinc-500">
                    Time (T-)
                  </div>
                  <div
                    className="absolute -bottom-6 text-[10px] text-orange-400"
                    style={{ left: `calc(${nowXPercent}% - 12px)` }}
                  >
                    NOW
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block">
                    Adjust timeline
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={0.5}
                    value={clampHours}
                    onChange={(e) => setHoursToDeparture(Number(e.target.value))}
                    disabled={isLoadSheetLocked}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>T-24h</span>
                    <span>T-0h</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span
                      className={`px-3 py-1 border text-xs tracking-widest ${
                        confidenceLevel === "LOW"
                          ? "border-red-500 text-red-300"
                          : confidenceLevel === "MEDIUM"
                          ? "border-amber-400 text-amber-200"
                          : "border-emerald-500 text-emerald-200"
                      }`}
                    >
                      Confidence: {confidenceLevel}
                    </span>
                    <span className="text-zinc-400">
                      Width {coneWidth.toLocaleString()}kg • Mid-line {formatKg(
                        (coneSnapshot.lower + coneSnapshot.upper) / 2
                      )}
                    </span>
                  </div>

                  {confidenceLevel === "LOW" && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4" />
                      Confidence too low for cargo release. Wait {recommendedWait} hours.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-5 flex flex-col gap-4">
              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-400">
                      Delta Comparison Engine
                    </p>
                    <p className="text-sm text-zinc-500">
                      Manual vs AI prediction
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${deltaBadgeClasses}`}>
                    {`${deltaIsLighter ? "-" : "+"}${Math.abs(delta).toLocaleString()}kg`}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-left">
                  <div className="border border-zinc-800 bg-zinc-900/40 p-3">
                    <p className="text-[10px] uppercase text-zinc-500 tracking-[0.3em]">
                      Standard Manual Estimate
                    </p>
                    <p className="text-xl font-mono text-zinc-300">{formatKg(manualEstimate)}</p>
                  </div>
                  <div className={`px-4 py-2 text-center font-semibold uppercase text-[10px] tracking-[0.3em] ${deltaBadgeClasses}`}>
                    {Math.abs(deltaPct).toFixed(1)}%<br />
                    {deltaIsLighter ? "Lighter" : "Heavier"}
                  </div>
                  <div className="border border-orange-500/50 bg-orange-500/10 p-3 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase text-orange-200 tracking-[0.3em]">
                          AI Precision Forecast
                        </p>
                        <p className="text-xl font-mono text-white">{formatKg(adjustedAi)}</p>
                      </div>
                      <button
                        onClick={handleJumpToOverride}
                        className="text-orange-300 text-xs border border-orange-400/60 px-2 py-1 uppercase tracking-widest hover:bg-orange-500/20 transition"
                      >
                        <Edit3 className="w-3 h-3 inline mr-1" /> Adjust
                      </button>
                    </div>
                    <p className="text-[10px] text-orange-200/70 mt-2">{deltaCaption}</p>
                  </div>
                </div>
              </div>

              <div
                ref={overrideCardRef}
                className={`border border-zinc-800 bg-zinc-950 p-4 transition ${
                  overrideHighlight ? "ring-2 ring-orange-500" : ""
                } ${isLoadSheetLocked ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <SlidersHorizontal className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-400">
                        Smart Override
                      </p>
                      <p className="text-sm text-zinc-500">
                        Human-in-the-loop buffer control
                      </p>
                    </div>
                  </div>
                  {overrideNote && (
                    <span className="text-[10px] text-emerald-300 uppercase tracking-[0.3em]">
                      Saved
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-2">
                      Buffer (kg)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={50}
                      value={overrideBuffer}
                      onChange={(e) => setOverrideBuffer(Number(e.target.value))}
                      disabled={isLoadSheetLocked}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-1">
                      <span>0kg</span>
                      <span>{overrideBuffer}kg</span>
                      <span>2000kg</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-2">
                      Why are you overriding?
                    </label>
                    <select
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      disabled={isLoadSheetLocked}
                      className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white p-2"
                    >
                      <option value="">Select reasoning</option>
                      {OVERRIDE_REASON_OPTIONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleApplyOverride}
                    disabled={!overrideReason || isLoadSheetLocked}
                    className={`w-full flex items-center justify-center gap-2 border px-4 py-2 text-xs font-bold tracking-widest uppercase transition ${
                      !overrideReason || isLoadSheetLocked
                        ? "border-zinc-700 text-zinc-600"
                        : "border-orange-500 text-orange-200 hover:bg-orange-500/20"
                    }`}
                  >
                    <Save className="w-4 h-4" /> Apply Smart Override
                  </button>

                  {overrideNote && (
                    <div className="text-xs text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> {overrideNote}
                    </div>
                  )}
                </div>
              </div>

              {(loadSheetWindowOpen || isLoadSheetLocked) && (
                <div className="border border-zinc-800 bg-zinc-950 p-4 relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center border border-zinc-700 text-orange-400">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-400">
                        Load Sheet Exporter
                      </p>
                      <p className="text-sm text-zinc-500">
                        Official numbers for cockpit release
                      </p>
                    </div>
                  </div>

                  {isLoadSheetLocked ? (
                    <div className="mt-4 text-sm text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Load sheet signed & dashboard locked.
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-zinc-500 mt-3">
                        T-30 minute gate reached. Dispatch requires captain sign-off.
                      </p>
                      <button
                        onClick={handleFinalizeLoadSheet}
                        className="mt-4 w-full border border-orange-500 text-orange-200 uppercase tracking-[0.3em] text-xs py-3 flex items-center justify-center gap-2 hover:bg-orange-500/20 transition"
                      >
                        <Save className="w-4 h-4" /> Finalize & Sign Load Sheet
                      </button>
                      {showStamp && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="stamp-in border-2 border-red-500 text-red-300 px-6 py-2 uppercase text-sm font-bold">
                            Stamped
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="col-span-8 flex flex-col border-r border-zinc-800 bg-zinc-950 p-6 overflow-hidden">
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

          <div className="h-10 mt-auto border-t border-zinc-800 pt-4 flex items-center justify-between text-xs font-mono text-zinc-600 shrink-0">
            <span>SYSTEM STATUS: NORMAL</span>
            <span className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-zinc-400" /> CONNECTION SECURE
            </span>
          </div>
        </section>

        <section className="col-span-4 flex flex-col bg-zinc-950 border-l border-zinc-800 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,1)] h-full overflow-hidden">
          <div className="p-1 border-b border-zinc-800 bg-zinc-900/50 h-32 shrink-0">
            <RevenueChart />
          </div>

          <div className="flex-1 min-h-0 flex flex-col relative">
            <ChatInterface
              messages={currentMessages}
              selectedFlight={currentFlight}
              onSendMessage={handleSendMessage}
              onActionClick={handleActionClick}
            />
          </div>
        </section>

        {isLoadSheetLocked && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
            <Lock className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-lg font-mono tracking-[0.3em] text-red-300 uppercase">
              Dashboard Locked
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              Load sheet issued to cockpit. Further edits disabled until next cycle.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AeromindPage;
