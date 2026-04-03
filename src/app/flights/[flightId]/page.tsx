import Link from "next/link";
import { ArrowLeft, Users, Luggage, Package, Gauge, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { CapacityGauge } from "@/components/flight/capacity-gauge";
import { CompartmentDiagram } from "@/components/flight/compartment-diagram";
import { ConfidenceBadge } from "@/components/flight/confidence-badge";
import { getFlight } from "@/lib/data/store";
import { runPrediction } from "@/lib/engine/predict";
import {
  formatWeight,
  formatVolume,
  formatPercent,
  formatNumber,
  formatCO2,
  formatRoute,
} from "@/lib/utils/formatting";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FlightDetailPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = await params;
  const flight = getFlight(flightId);

  if (!flight) notFound();

  const prediction = runPrediction(flight);
  if (!prediction) notFound();

  const { route, aircraft, passengerEstimate, baggageEstimate, availableCargo, compartmentLoading, efficiency } = prediction;
  const depTime = new Date(flight.departureTime);
  const arrTime = new Date(flight.arrivalTime);
  const totalSeats = aircraft.seatCapacity.economy + aircraft.seatCapacity.business + aircraft.seatCapacity.first;

  // Total used weight in hold = baggage + cargo
  const totalHoldUsedKg = compartmentLoading.reduce((s, c) => s + c.baggageWeightKg + c.cargoWeightKg, 0);
  const totalHoldUsedM3 = compartmentLoading.reduce((s, c) => s + c.baggageVolumeM3 + c.cargoVolumeM3, 0);

  return (
    <div>
      {/* Back link */}
      <Link href="/flights" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to flights
      </Link>

      {/* Flight header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {flight.flightNumber} · {formatRoute(route.origin, route.destination)}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {aircraft.name} · {depTime.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })} · {depTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} — {arrTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{route.region}</Badge>
            <Badge variant="outline">{route.distanceKm.toLocaleString()} km</Badge>
            <Badge
              className={flight.status === "scheduled" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
              variant={flight.status === "departed" ? "secondary" : "default"}
            >
              {flight.status}
            </Badge>
          </div>
        </div>
        <ConfidenceBadge level={availableCargo.confidenceLevel} method={passengerEstimate.method} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Prediction */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-500" /> Capacity Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-600">{formatWeight(availableCargo.weightKg)}</p>
                <p className="text-sm text-slate-500">Available weight</p>
                <p className="text-xs text-slate-400 mt-1">
                  Range: {formatWeight(availableCargo.confidenceBand.lowWeightKg)} — {formatWeight(availableCargo.confidenceBand.highWeightKg)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-violet-600">{formatVolume(availableCargo.volumeM3)}</p>
                <p className="text-sm text-slate-500">Available volume</p>
                <p className="text-xs text-slate-400 mt-1">
                  Range: {formatVolume(availableCargo.confidenceBand.lowVolumeM3)} — {formatVolume(availableCargo.confidenceBand.highVolumeM3)}
                </p>
              </div>
            </div>
            <CapacityGauge
              usedWeightKg={totalHoldUsedKg}
              totalWeightKg={aircraft.cargoHold.totalWeightLimitKg}
              usedVolumeM3={totalHoldUsedM3}
              totalVolumeM3={aircraft.cargoHold.totalVolumeM3}
            />
          </CardContent>
        </Card>

        {/* Passenger & Baggage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" /> Passengers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Estimated</span>
                  <span className="font-semibold">{formatNumber(passengerEstimate.count)} / {formatNumber(totalSeats)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: `${Math.min((passengerEstimate.count / totalSeats) * 100, 100)}%` }}
                  />
                </div>
                {flight.bookedPassengers !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Booked</span>
                    <span className="font-medium text-emerald-600">{formatNumber(flight.bookedPassengers)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Luggage className="w-5 h-5 text-sky-500" /> Baggage Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pieces</span>
                  <span className="font-medium">{formatNumber(baggageEstimate.totalPieces)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total weight</span>
                  <span className="font-medium">{formatWeight(baggageEstimate.totalWeightKg)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total volume</span>
                  <span className="font-medium">{formatVolume(baggageEstimate.totalVolumeM3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg per bag</span>
                  <span className="font-medium">{baggageEstimate.avgWeightPerBagKg} kg / {baggageEstimate.avgVolumePerBagM3} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uncertainty</span>
                  <span className="font-medium text-amber-600">&plusmn;{formatPercent(baggageEstimate.uncertaintyMarginPct)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compartment Loading */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Compartment Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <CompartmentDiagram compartments={compartmentLoading} />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {compartmentLoading.map((comp) => (
              <div key={comp.compartmentId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">{comp.compartmentName}</h4>
                  <Badge
                    className={
                      comp.utilizationPct >= 0.85
                        ? "bg-red-100 text-red-700"
                        : comp.utilizationPct >= 0.6
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-600"
                    }
                  >
                    {(comp.utilizationPct * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Baggage</span>
                    <span>{formatWeight(comp.baggageWeightKg)} / {formatVolume(comp.baggageVolumeM3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cargo</span>
                    <span className="text-sky-600 font-medium">{formatWeight(comp.cargoWeightKg)} / {formatVolume(comp.cargoVolumeM3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining</span>
                    <span className="text-emerald-600">{formatWeight(comp.remainingWeightKg)} / {formatVolume(comp.remainingVolumeM3)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="text-slate-500">Max</span>
                    <span>{formatWeight(comp.maxWeightKg)} / {formatVolume(comp.maxVolumeM3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Efficiency */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-500" /> Efficiency Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-sky-50 rounded-lg">
              <p className="text-2xl font-bold text-sky-600">+{formatWeight(efficiency.additionalCargoVsBaseline.weightKg)}</p>
              <p className="text-sm text-slate-600 mt-1">Additional cargo vs baseline</p>
              <p className="text-xs text-slate-400">+{formatPercent(efficiency.additionalCargoVsBaseline.percentImprovement)} improvement</p>
            </div>
            <div className="text-center p-4 bg-violet-50 rounded-lg">
              <p className="text-2xl font-bold text-violet-600">{efficiency.cargoPerEnergyUnit.kgCargoPerKgFuel.toFixed(3)}</p>
              <p className="text-sm text-slate-600 mt-1">kg cargo / kg fuel</p>
              <p className="text-xs text-slate-400">Energy efficiency ratio</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">-{formatCO2(efficiency.carbonComparison.baselineKgCO2 - efficiency.carbonComparison.optimizedKgCO2)}</p>
              <p className="text-sm text-slate-600 mt-1">CO₂ reduction</p>
              <p className="text-xs text-slate-400">
                {formatCO2(efficiency.carbonComparison.baselineKgCO2)} → {formatCO2(efficiency.carbonComparison.optimizedKgCO2)} ({formatPercent(efficiency.carbonComparison.savingPct)} saved)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
