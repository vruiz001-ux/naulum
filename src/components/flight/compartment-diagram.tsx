interface CompartmentData {
  compartmentId: string;
  compartmentName: string;
  utilizationPct: number;
  baggageWeightKg: number;
  cargoWeightKg: number;
  maxWeightKg: number;
}

function getColor(pct: number): string {
  if (pct >= 0.85) return "#ef4444"; // red - near capacity
  if (pct >= 0.65) return "#0ea5e9"; // sky - good utilization
  if (pct >= 0.4) return "#38bdf8";  // lighter sky
  return "#7dd3fc";                  // light - underutilized
}

export function CompartmentDiagram({ compartments }: { compartments: CompartmentData[] }) {
  const fwd = compartments.find((c) => c.compartmentId === "FWD");
  const aft = compartments.find((c) => c.compartmentId === "AFT");
  const bulk = compartments.find((c) => c.compartmentId === "BULK");

  return (
    <div className="w-full">
      {/* Aircraft silhouette with holds */}
      <svg viewBox="0 0 600 160" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Aircraft body outline */}
        <path
          d="M 50 80 Q 50 40, 120 40 L 480 40 Q 550 40, 570 65 L 580 80 L 570 95 Q 550 120, 480 120 L 120 120 Q 50 120, 50 80 Z"
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        {/* Nose */}
        <path
          d="M 570 65 Q 595 72, 600 80 Q 595 88, 570 95"
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        {/* Tail */}
        <path
          d="M 50 80 Q 30 40, 20 20 L 60 40"
          fill="#f1f5f9"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        {/* Wing stub */}
        <rect x="240" y="35" width="120" height="8" rx="2" fill="#cbd5e1" />
        <rect x="240" y="117" width="120" height="8" rx="2" fill="#cbd5e1" />

        {/* Divider line (cabin/cargo) */}
        <line x1="100" y1="85" x2="540" y2="85" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
        <text x="320" y="70" textAnchor="middle" className="text-[10px]" fill="#94a3b8">CABIN</text>
        <text x="320" y="98" textAnchor="middle" className="text-[10px]" fill="#94a3b8">CARGO HOLDS</text>

        {/* FWD Hold */}
        {fwd && (
          <g>
            <rect
              x="350"
              y="100"
              width={150 * Math.min(fwd.utilizationPct, 1)}
              height="14"
              rx="2"
              fill={getColor(fwd.utilizationPct)}
              opacity="0.8"
            />
            <rect x="350" y="100" width="150" height="14" rx="2" fill="none" stroke="#64748b" strokeWidth="1" />
            <text x="425" y="130" textAnchor="middle" className="text-[9px] font-medium" fill="#475569">
              FWD {(fwd.utilizationPct * 100).toFixed(0)}%
            </text>
          </g>
        )}

        {/* AFT Hold */}
        {aft && (
          <g>
            <rect
              x="160"
              y="100"
              width={140 * Math.min(aft.utilizationPct, 1)}
              height="14"
              rx="2"
              fill={getColor(aft.utilizationPct)}
              opacity="0.8"
            />
            <rect x="160" y="100" width="140" height="14" rx="2" fill="none" stroke="#64748b" strokeWidth="1" />
            <text x="230" y="130" textAnchor="middle" className="text-[9px] font-medium" fill="#475569">
              AFT {(aft.utilizationPct * 100).toFixed(0)}%
            </text>
          </g>
        )}

        {/* BULK Hold */}
        {bulk && (
          <g>
            <rect
              x="100"
              y="100"
              width={45 * Math.min(bulk.utilizationPct, 1)}
              height="14"
              rx="2"
              fill={getColor(bulk.utilizationPct)}
              opacity="0.8"
            />
            <rect x="100" y="100" width="45" height="14" rx="2" fill="none" stroke="#64748b" strokeWidth="1" />
            <text x="122" y="130" textAnchor="middle" className="text-[9px] font-medium" fill="#475569">
              BULK {(bulk.utilizationPct * 100).toFixed(0)}%
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-sky-400" />
          <span className="text-xs text-slate-500">Cargo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-300" />
          <span className="text-xs text-slate-500">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-400" />
          <span className="text-xs text-slate-500">Near capacity</span>
        </div>
      </div>
    </div>
  );
}
