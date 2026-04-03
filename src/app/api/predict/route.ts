import { Flight, Season } from "@/types";
import { runPrediction } from "@/lib/engine/predict";

export const dynamic = "force-dynamic";

function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export async function POST(request: Request) {
  const body = await request.json();
  const { aircraftType, routeId, departureTime, passengers } = body;

  if (!aircraftType || !routeId || !departureTime) {
    return Response.json(
      { error: "Missing required fields: aircraftType, routeId, departureTime" },
      { status: 400 }
    );
  }

  const date = new Date(departureTime);
  const flight: Flight = {
    id: `ADHOC-${aircraftType}-${routeId}-${date.toISOString()}`,
    flightNumber: "NL ADHOC",
    routeId,
    aircraftType,
    departureTime: date.toISOString(),
    arrivalTime: date.toISOString(), // Not used in prediction
    dayOfWeek: date.getDay(),
    season: getSeason(date.getMonth() + 1),
    bookedPassengers: passengers || undefined,
    status: "scheduled",
  };

  const prediction = runPrediction(flight);
  if (!prediction) {
    return Response.json(
      { error: "Invalid aircraft type or route" },
      { status: 400 }
    );
  }

  return Response.json(prediction);
}
