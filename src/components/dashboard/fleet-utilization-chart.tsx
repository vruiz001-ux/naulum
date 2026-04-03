"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FleetUtilData {
  aircraft: string;
  utilization: number;
  available: number;
}

export function FleetUtilizationChart({ data }: { data: FleetUtilData[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={12} />
        <YAxis type="category" dataKey="aircraft" width={100} fontSize={12} />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)}%`, "Hold Utilization"]}
          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
        />
        <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={24}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.utilization > 70 ? "#0ea5e9" : entry.utilization > 50 ? "#38bdf8" : "#7dd3fc"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
