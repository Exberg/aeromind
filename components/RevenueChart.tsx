import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { time: "10:00", val: 4000 },
  { time: "10:05", val: 3000 },
  { time: "10:10", val: 2000 },
  { time: "10:15", val: 2780 },
  { time: "10:20", val: 1890 },
  { time: "10:25", val: 2390 },
  { time: "10:30", val: 3490 },
  { time: "10:35", val: 4200 },
  { time: "10:40", val: 5100 },
  { time: "10:45", val: 5800 },
  { time: "10:50", val: 6200 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="h-40 w-full relative group bg-zinc-950">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-white animate-pulse"></div>
        <span className="font-mono text-[10px] text-white uppercase tracking-wider">
          Live Revenue
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              borderColor: "#27272a",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="step"
            dataKey="val"
            stroke="#ffffff"
            strokeWidth={1}
            fillOpacity={1}
            fill="url(#colorVal)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
