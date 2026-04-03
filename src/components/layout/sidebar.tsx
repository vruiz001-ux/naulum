"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plane, Calculator, ShipWheel } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Flights", href: "/flights", icon: Plane },
  { name: "Predict", href: "/predict", icon: Calculator },
  { name: "Fleet", href: "/fleet", icon: ShipWheel },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-sm">
          N
        </div>
        <div>
          <h1 className="font-semibold text-lg leading-none">Naulum</h1>
          <p className="text-xs text-slate-400 mt-0.5">Belly Cargo Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sky-500/20 text-sky-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-slate-500">Naulum MVP v0.1</p>
      </div>
    </aside>
  );
}
