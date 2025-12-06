import React from "react";
import { Flight } from "../aeromindTypes";
import {
  Plane,
  Package,
  AlertTriangle,
  ArrowRight,
  Activity,
} from "lucide-react";

interface FlightCardProps {
  flight: Flight;
  isSelected?: boolean;
  onClick?: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  isSelected,
  onClick,
}) => {
  const { total, booked, ghost, risk } = flight.capacity;

  // Calculate percentages for visualization
  const bookedPct = (booked / total) * 100;
  const ghostPct = (ghost / total) * 100;
  const riskPct = (risk / total) * 100;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 bg-zinc-900 border transition-all duration-300 group cursor-pointer ${
        isSelected
          ? "border-orange-500 bg-zinc-900 shadow-[0_4px_20px_rgba(249,115,22,0.1)]"
          : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Active Indicator Strip */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
      )}

      {/* Decorative Corner Brackets (Monochrome) */}
      <div
        className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${
          isSelected ? "border-orange-500" : "border-zinc-700"
        }`}
      ></div>
      <div
        className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${
          isSelected ? "border-orange-500" : "border-zinc-700"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${
          isSelected ? "border-orange-500" : "border-zinc-700"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${
          isSelected ? "border-orange-500" : "border-zinc-700"
        }`}
      ></div>

      <div className="flex justify-between items-start mb-4 pl-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane
              className={`w-4 h-4 ${
                flight.status === "IN-AIR" ? "text-orange-500" : "text-zinc-500"
              }`}
            />
            <h3
              className={`text-xl font-display font-bold tracking-wide transition-colors ${
                isSelected ? "text-orange-500" : "text-zinc-200"
              }`}
            >
              {flight.code}
            </h3>
            {isSelected && (
              <Activity className="w-3 h-3 text-orange-500 ml-2 animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span className="text-zinc-300">{flight.origin}</span>
            <ArrowRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-300">{flight.destination}</span>
            <span className="ml-2 text-zinc-700">|</span>
            <span className="ml-2">ETD: {flight.etd}</span>
          </div>
        </div>
        <div
          className={`px-2 py-1 text-[10px] font-mono font-bold border rounded-sm tracking-widest ${
            flight.status === "IN-AIR"
              ? "border-orange-500 text-orange-500 bg-zinc-800"
              : flight.status === "DELAYED"
              ? "border-zinc-600 text-zinc-400 border-dashed"
              : "border-zinc-700 text-zinc-500"
          }`}
        >
          {flight.status}
        </div>
      </div>

      {/* The Ghost Capacity Visualization - Monochrome & Textured */}
      <div className="space-y-2 pl-3">
        <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500 mb-1">
          <span>Capacity Load</span>
          <span className="text-zinc-400">
            {Math.round(((booked + ghost) / total) * 100)}% Saturation
          </span>
        </div>

        {/* The Bar - High Contrast */}
        <div className="h-4 w-full bg-zinc-950 border border-zinc-700 relative flex overflow-hidden">
          {/* Booked (Safe) - Dark Grey */}
          <div
            style={{ width: `${bookedPct}%` }}
            className="h-full bg-zinc-800 border-r border-zinc-950 relative"
          ></div>

          {/* Ghost (Opportunity) - PURE WHITE */}
          <div
            style={{ width: `${ghostPct}%` }}
            className="h-full bg-orange-500 border-r border-zinc-950 relative flex items-center justify-center overflow-hidden"
          >
            <span className="text-[9px] font-bold text-black z-10 whitespace-nowrap px-1">
              GHOST
            </span>
          </div>

          {/* Risk (Danger) - Striped Pattern */}
          <div
            style={{ width: `${riskPct}%` }}
            className="h-full bg-zinc-950 relative"
          >
            {/* Diagonal Stripes for Risk */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #3f3f46 25%, transparent 25%, transparent 50%, #3f3f46 50%, #3f3f46 75%, transparent 75%, transparent)",
                backgroundSize: "8px 8px",
              }}
            ></div>
          </div>
        </div>

        {/* Legend / Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-zinc-600">BOOKED</span>
            <span className="text-sm font-mono text-zinc-400">{booked}kg</span>
          </div>
          <div className="flex flex-col border-l border-zinc-800 pl-2">
            <span className="text-[9px] font-mono text-orange-500 flex items-center gap-1 font-bold">
              <Package className="w-3 h-3" /> GHOST
            </span>
            <span className="text-sm font-mono text-orange-500 font-bold">
              {ghost}kg
            </span>
          </div>
          <div className="flex flex-col border-l border-zinc-800 pl-2">
            <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> RISK
            </span>
            <span className="text-sm font-mono text-zinc-500">{risk}kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
