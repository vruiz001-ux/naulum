import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({ level, method }: { level: number; method: string }) {
  const pct = (level * 100).toFixed(0);
  const color = level >= 0.85 ? "bg-emerald-100 text-emerald-700" : level >= 0.7 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  const label = level >= 0.85 ? "High" : level >= 0.7 ? "Medium" : "Low";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Badge className={cn("text-sm px-3 py-1", color)}>
          {pct}% {label}
        </Badge>
      </div>
      <p className="text-xs text-slate-500 capitalize">{method.replace(/-/g, " ")}</p>
    </div>
  );
}
