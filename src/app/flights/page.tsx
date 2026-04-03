import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/layout/header";
import { getFlights } from "@/lib/data/store";
import { getRoute } from "@/lib/data/routes";
import { getAircraftProfile } from "@/lib/data/aircraft-profiles";
import { runPrediction } from "@/lib/engine/predict";
import { formatWeight, formatVolume, formatPercent, formatRoute } from "@/lib/utils/formatting";

export const dynamic = "force-dynamic";

export default function FlightsPage() {
  const flights = getFlights();

  const enriched = flights.map((f) => {
    const route = getRoute(f.routeId);
    const aircraft = getAircraftProfile(f.aircraftType);
    const prediction = runPrediction(f);
    return { flight: f, route, aircraft, prediction };
  }).filter((e) => e.route && e.aircraft);

  return (
    <div>
      <Header
        title="Flight Schedule"
        subtitle={`${flights.length} flights across 7 days`}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Aircraft</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cargo Capacity</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map(({ flight, route, aircraft, prediction }) => {
                const depTime = new Date(flight.departureTime);
                return (
                  <TableRow key={flight.id} className="cursor-pointer hover:bg-slate-50">
                    <TableCell>
                      <Link
                        href={`/flights/${flight.id}`}
                        className="font-medium text-sky-600 hover:text-sky-700"
                      >
                        {flight.flightNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatRoute(route!.origin, route!.destination)}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {route!.region}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{aircraft!.typeCode}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {depTime.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}{" "}
                      {depTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={flight.status === "departed" ? "secondary" : "default"}
                        className={
                          flight.status === "scheduled"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }
                      >
                        {flight.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {prediction
                        ? formatWeight(prediction.availableCargo.weightKg)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {prediction
                        ? formatVolume(prediction.availableCargo.volumeM3)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {prediction ? (
                        <span
                          className={
                            prediction.availableCargo.confidenceLevel > 0.8
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }
                        >
                          {formatPercent(prediction.availableCargo.confidenceLevel)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
