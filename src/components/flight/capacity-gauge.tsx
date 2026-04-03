"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeProps {
  label: string;
  used: number;
  total: number;
  unit: string;
  color: string;
}

function Gauge({ label, used, total, unit, color }: GaugeProps) {
  const pct = Math.min((used / total) * 100, 100);
  const remaining = 100 - pct;
  const data = [
    { value: pct },
    { value: remaining },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={210}
              endAngle={-30}
              innerRadius={42}
              outerRadius={56}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-900">{pct.toFixed(0)}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-700 mt-2">{label}</p>
      <p className="text-xs text-slate-500">
        {used.toLocaleString("en-US", { maximumFractionDigits: unit === "m\u00B3" ? 1 : 0 })} / {total.toLocaleString("en-US", { maximumFractionDigits: unit === "m\u00B3" ? 1 : 0 })} {unit}
      </p>
    </div>
  );
}

interface CapacityGaugeProps {
  usedWeightKg: number;
  totalWeightKg: number;
  usedVolumeM3: number;
  totalVolumeM3: number;
}

export function CapacityGauge({ usedWeightKg, totalWeightKg, usedVolumeM3, totalVolumeM3 }: CapacityGaugeProps) {
  return (
    <div className="flex justify-center gap-12">
      <Gauge label="Weight" used={usedWeightKg} total={totalWeightKg} unit="kg" color="#0ea5e9" />
      <Gauge label="Volume" used={usedVolumeM3} total={totalVolumeM3} unit="m³" color="#8b5cf6" />
    </div>
  );
}
