import React from "react";
import { PackingResult, Container } from "../types";
import { Activity, Scale, Box, AlertCircle } from "lucide-react";
import { THEME } from "../aeromindConstants";

interface StatsPanelProps {
  result: PackingResult;
  container: Container;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ result, container }) => {
  const percentFull = Math.round(
    (result.totalWeight / container.maxWeight) * 100
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {/* Weight Card */}
      <div className="hud-border hud-corner p-4 bg-black">
        <div className="flex items-center gap-2 mb-2 text-white">
          <Scale size={16} />
          <h3 className="text-xs font-bold tracking-widest uppercase border-b border-white/20 pb-1 w-full">
            Total Payload
          </h3>
        </div>
        <div className="text-2xl font-mono text-white mt-2">
          {result.totalWeight.toLocaleString()}{" "}
          <span className="text-sm text-neutral-500">KG</span>
        </div>
        <div className="w-full bg-neutral-900 border border-neutral-800 h-2 mt-2">
          <div
            className={`h-full transition-all duration-500 bg-orange-500`}
            style={{ width: `${Math.min(percentFull, 100)}%` }}
          ></div>
        </div>
        <div className="text-[10px] text-neutral-400 mt-1 text-right">
          {percentFull}% MAX CAPACITY
        </div>
      </div>

      {/* Item Count */}
      <div className="hud-border hud-corner p-4 bg-black">
        <div className="flex items-center gap-2 mb-2 text-white">
          <Box size={16} />
          <h3 className="text-xs font-bold tracking-widest uppercase border-b border-white/20 pb-1 w-full">
            Manifest Count
          </h3>
        </div>
        <div className="text-2xl font-mono text-white mt-2">
          {result.placedItems.length}{" "}
          <span className="text-sm text-neutral-500">UNITS</span>
        </div>
        <div className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
          {result.rejectedItems.length > 0 && (
            <AlertCircle size={10} className="text-white" />
          )}
          {result.rejectedItems.length} FAILED TO LOAD
        </div>
      </div>

      {/* CG Coordinates */}
      <div className="hud-border hud-corner p-4 bg-black col-span-2">
        <div className="flex items-center gap-2 mb-2 text-white">
          <Activity size={16} />
          <h3 className="text-xs font-bold tracking-widest uppercase border-b border-white/20 pb-1 w-full">
            CG Coordinates (Ref. Datum)
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4 font-mono text-sm mt-2">
          <div>
            <span className="text-neutral-500 block text-[10px] mb-1">
              LONGITUDINAL (Y)
            </span>
            <span className="text-white text-lg border border-neutral-800 px-2 py-0.5 block w-fit">
              {result.aircraftCG.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] mb-1">
              LATERAL (X)
            </span>
            <span
              className={`text-lg border px-2 py-0.5 block w-fit ${
                Math.abs(result.centerOfGravity.x - container.width / 2) > 10
                  ? "border-orange-500 text-orange-500"
                  : "border-neutral-800 text-white"
              }`}
            >
              {(result.centerOfGravity.x - container.width / 2).toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] mb-1">
              STATUS
            </span>
            <span className="text-orange-500 text-lg font-bold">OPTIMAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
