import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-sm font-medium mt-1",
                  trend.positive ? "text-emerald-600" : "text-red-500"
                )}
              >
                {trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
