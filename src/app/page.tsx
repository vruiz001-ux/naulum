import { Plane, Package, DollarSign, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { MetricCard } from "@/components/shared/metric-card";
import { FleetUtilizationChart } from "@/components/dashboard/fleet-utilization-chart";
import { getFlights, getScheduledFlights } from "@/lib/data/store";
import { getRoute } from "@/lib/data/routes";
import { getAircraftProfile, aircraftProfiles } from "@/lib/data/aircraft-profiles";
import { runPrediction } from "@/lib/engine/predict";
import { formatWeight, formatCurrency, formatCO2, formatRoute, formatPercent } from "@/lib/utils/formatting";
import { CARGO_RATE_PER_KG } from "@/lib/utils/constants";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const allFlights = getFlights();
  const scheduled = getScheduledFlights();
  const upcoming = scheduled.slice(0, 8);

  // Compute predictions for scheduled flights
  const predictions = scheduled.map((f) => ({
    flight: f,
    prediction: runPrediction(f),
  })).filter((p) => p.prediction !== null);

  // KPIs
  const totalScheduled = scheduled.length;
  const totalAvailableKg = predictions.reduce(
    (sum, p) => sum + (p.prediction?.availableCargo.weightKg ?? 0),
    0
  );
  const totalRevenue = predictions.reduce((sum, p) => {
    const route = getRoute(p.flight.routeId);
    const rate = route ? CARGO_RATE_PER_KG[route.region] ?? 2.5 : 2.5;
    return sum + (p.prediction?.availableCargo.weightKg ?? 0) * rate;
  }, 0);
  const totalCO2Saved = predictions.reduce(
    (sum, p) => sum + ((p.prediction?.efficiency.carbonComparison.baselineKgCO2 ?? 0) - (p.prediction?.efficiency.carbonComparison.optimizedKgCO2 ?? 0)),
    0
  );
  const avgImprovement = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + (p.prediction?.efficiency.additionalCargoVsBaseline.percentImprovement ?? 0), 0) / predictions.length
    : 0;

  // Fleet utilization
  const fleetUtil = aircraftProfiles.map((ac) => {
    const acFlights = predictions.filter((p) => p.flight.aircraftType === ac.typeCode);
    if (acFlights.length === 0) return { aircraft: ac.typeCode, utilization: 0, available: 0 };
    const avgUtil = acFlights.reduce((sum, p) => {
      const totalAlloc = p.prediction!.compartmentLoading.reduce((s, c) => s + c.utilizationPct, 0);
      return sum + (totalAlloc / p.prediction!.compartmentLoading.length) * 100;
    }, 0) / acFlights.length;
    return { aircraft: ac.typeCode, utilization: parseFloat(avgUtil.toFixed(1)), available: acFlights.length };
  });

  return (
    <div>
      <Header title="Dashboard" subtitle="Belly cargo capacity overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Scheduled Flights"
          value={totalScheduled.toString()}
          subtitle="Next 7 days"
          icon={<Plane className="w-5 h-5" />}
        />
        <MetricCard
          title="Available Capacity"
          value={formatWeight(totalAvailableKg)}
          trend={{ value: `+${formatPercent(avgImprovement)} vs baseline`, positive: true }}
          icon={<Package className="w-5 h-5" />}
        />
        <MetricCard
          title="Revenue Opportunity"
          value={formatCurrency(totalRevenue)}
          subtitle="At market rates"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="CO₂ Savings"
          value={formatCO2(totalCO2Saved)}
          subtitle="vs dedicated freighters"
          icon={<Leaf className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Flights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.map((flight) => {
                const route = getRoute(flight.routeId);
                const aircraft = getAircraftProfile(flight.aircraftType);
                const prediction = runPrediction(flight);
                if (!route || !aircraft || !prediction) return null;
                const depTime = new Date(flight.departureTime);
                return (
                  <Link
                    key={flight.id}
                    href={`/flights/${flight.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">{flight.flightNumber}</p>
                        <p className="text-slate-500">{formatRoute(route.origin, route.destination)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {aircraft.typeCode}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {depTime.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}{" "}
                        {depTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        {formatWeight(prediction.availableCargo.weightKg)}
                      </p>
                      <p className="text-xs text-slate-400">available</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/flights"
              className="block text-center text-sm text-sky-600 hover:text-sky-700 font-medium mt-4"
            >
              View all flights
            </Link>
          </CardContent>
        </Card>

        {/* Fleet Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fleet Hold Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <FleetUtilizationChart data={fleetUtil} />
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Efficiency Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-sky-600">{formatPercent(avgImprovement)}</p>
              <p className="text-sm text-slate-500 mt-1">Avg capacity improvement</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{formatCO2(totalCO2Saved)}</p>
              <p className="text-sm text-slate-500 mt-1">Estimated CO2 avoided</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{formatWeight(totalAvailableKg)}</p>
              <p className="text-sm text-slate-500 mt-1">Additional cargo capacity unlocked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
