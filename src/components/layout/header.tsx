import { Plane } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      )}
    </header>
  );
}
