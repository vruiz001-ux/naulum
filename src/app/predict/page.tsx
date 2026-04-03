"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Loader2, Package, Users, Luggage, Leaf } from "lucide-react";
import { CapacityGauge } from "@/components/flight/capacity-gauge";
import { CompartmentDiagram } from "@/components/flight/compartment-diagram";
import type { PredictionResult } from "@/types";

const aircraftOptions = [
  { value: "A320", label: "Airbus A320-200" },
  { value: "B737-800", label: "Boeing 737-800" },
  { value: "A330-300", label: "Airbus A330-300" },
  { value: "B777-300ER", label: "Boeing 777-300ER" },
  { value: "B787-9", label: "Boeing 787-9" },
];

const routeOptions = [
  { value: "FRA-LHR", label: "FRA → LHR (Short-haul)" },
  { value: "CDG-BCN", label: "CDG → BCN (Short-haul)" },
  { value: "AMS-MUC", label: "AMS → MUC (Short-haul)" },
  { value: "IST-VIE", label: "IST → VIE (Short-haul)" },
  { value: "DXB-BOM", label: "DXB → BOM (Medium-haul)" },
  { value: "FRA-DXB", label: "FRA → DXB (Medium-haul)" },
  { value: "LHR-JFK", label: "LHR → JFK (Medium-haul)" },
  { value: "CDG-JFK", label: "CDG → JFK (Medium-haul)" },
  { value: "IST-JED", label: "IST → JED (Medium-haul)" },
  { value: "SIN-LHR", label: "SIN → LHR (Long-haul)" },
  { value: "DXB-SYD", label: "DXB → SYD (Long-haul)" },
  { value: "FRA-SIN", label: "FRA → SIN (Long-haul)" },
  { value: "LHR-HKG", label: "LHR → HKG (Long-haul)" },
  { value: "DXB-NRT", label: "DXB → NRT (Long-haul)" },
  { value: "SIN-SYD", label: "SIN → SYD (Long-haul)" },
];

export default function PredictPage() {
  const [aircraftType, setAircraftType] = useState("");
  const [routeId, setRouteId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [passengers, setPassengers] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aircraftType || !routeId || !departureTime) {
      setError("Please fill in aircraft, route, and departure time.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aircraftType,
          routeId,
          departureTime,
          passengers: passengers ? parseInt(passengers) : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Prediction failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number, dec = 0) =>
    n.toLocaleString("en-US", { maximumFractionDigits: dec });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Predict Cargo Capacity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Run a what-if prediction for any flight configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-500" /> Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="aircraft">Aircraft Type</Label>
                <Select value={aircraftType} onValueChange={(v) => setAircraftType(v ?? "")}>
                  <SelectTrigger id="aircraft" className="mt-1">
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    {aircraftOptions.map((ac) => (
                      <SelectItem key={ac.value} value={ac.value}>
                        {ac.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="route">Route</Label>
                <Select value={routeId} onValueChange={(v) => setRouteId(v ?? "")}>
                  <SelectTrigger id="route" className="mt-1">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routeOptions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="departure">Departure Date & Time</Label>
                <Input
                  id="departure"
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="passengers">
                  Booked Passengers <span className="text-slate-400">(optional)</span>
                </Label>
                <Input
                  id="passengers"
                  type="number"
                  placeholder="Leave blank for estimate"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Predicting...
                  </>
                ) : (
                  "Run Prediction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2">
          {!result && !loading && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-slate-400">
              <div className="text-center">
                <Package className="w-10 h-10 mx-auto mb-2" />
                <p>Configure a flight and run prediction</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {result.route.originCity} → {result.route.destinationCity}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {result.aircraft.name} · {result.route.region} · {result.route.distanceKm.toLocaleString()} km
                      </p>
                    </div>
                    <Badge
                      className={
                        result.availableCargo.confidenceLevel >= 0.85
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {(result.availableCargo.confidenceLevel * 100).toFixed(0)}% Confidence
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Cargo Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-sky-600">{fmt(result.availableCargo.weightKg)} kg</p>
                      <p className="text-sm text-slate-500">Weight</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-violet-600">{result.availableCargo.volumeM3.toFixed(1)} m³</p>
                      <p className="text-sm text-slate-500">Volume</p>
                    </div>
                  </div>
                  <CapacityGauge
                    usedWeightKg={result.baggageEstimate.totalWeightKg}
                    totalWeightKg={result.aircraft.cargoHold.totalWeightLimitKg}
                    usedVolumeM3={result.baggageEstimate.totalVolumeM3}
                    totalVolumeM3={result.aircraft.cargoHold.totalVolumeM3}
                  />
                </CardContent>
              </Card>

              {/* Compartment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compartment Loading</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompartmentDiagram compartments={result.compartmentLoading} />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {result.compartmentLoading.map((comp) => (
                      <div key={comp.compartmentId} className="border rounded-lg p-3 text-center">
                        <p className="font-semibold text-sm">{comp.compartmentName}</p>
                        <p className="text-lg font-bold text-sky-600">{(comp.utilizationPct * 100).toFixed(0)}%</p>
                        <p className="text-xs text-slate-500">
                          Cargo: {fmt(comp.cargoWeightKg)} kg
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="w-5 h-5 mx-auto text-sky-500 mb-1" />
                    <p className="text-xl font-bold">{fmt(result.passengerEstimate.count)}</p>
                    <p className="text-xs text-slate-500">Passengers est.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Luggage className="w-5 h-5 mx-auto text-sky-500 mb-1" />
                    <p className="text-xl font-bold">{fmt(result.baggageEstimate.totalWeightKg)} kg</p>
                    <p className="text-xs text-slate-500">Baggage weight</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Leaf className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                    <p className="text-xl font-bold text-emerald-600">+{fmt(result.efficiency.additionalCargoVsBaseline.weightKg)} kg</p>
                    <p className="text-xs text-slate-500">vs baseline</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
