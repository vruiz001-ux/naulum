import { getFlights, getScheduledFlights } from "@/lib/data/store";
import { getRoute } from "@/lib/data/routes";
import { getAircraftProfile } from "@/lib/data/aircraft-profiles";
import { runPrediction } from "@/lib/engine/predict";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");
  const withPrediction = searchParams.get("predict") === "true";

  let flights = status === "scheduled" ? getScheduledFlights() : getFlights();
  flights = flights.slice(0, limit);

  if (withPrediction) {
    const results = flights.map((f) => {
      const prediction = runPrediction(f);
      const route = getRoute(f.routeId);
      const aircraft = getAircraftProfile(f.aircraftType);
      return {
        ...f,
        route,
        aircraft,
        prediction: prediction
          ? {
              availableCargo: prediction.availableCargo,
              efficiency: prediction.efficiency,
              passengerEstimate: prediction.passengerEstimate,
            }
          : null,
      };
    });
    return Response.json(results);
  }

  const enriched = flights.map((f) => ({
    ...f,
    route: getRoute(f.routeId),
    aircraft: getAircraftProfile(f.aircraftType),
  }));

  return Response.json(enriched);
}
