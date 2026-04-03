import { AircraftProfile, Flight, Route, PassengerEstimate } from "@/types";
import {
  BASE_LOAD_FACTOR,
  DAY_OF_WEEK_MODIFIER,
  getDepartureModifier,
} from "@/lib/utils/constants";

// Deterministic jitter from flight ID
function jitterFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return ((hash & 0xffff) / 0xffff - 0.5) * 0.06; // +/- 3%
}

export function estimatePassengers(
  aircraft: AircraftProfile,
  route: Route,
  flight: Flight
): PassengerEstimate {
  const totalSeats =
    aircraft.seatCapacity.economy +
    aircraft.seatCapacity.business +
    aircraft.seatCapacity.first;

  // Base load factor for route type
  let loadFactor: number = BASE_LOAD_FACTOR[route.region];

  // Seasonal adjustment
  loadFactor *= route.seasonalDemand[flight.season];

  // Day of week
  loadFactor += DAY_OF_WEEK_MODIFIER[flight.dayOfWeek] ?? 0;

  // Departure time
  const hour = new Date(flight.departureTime).getUTCHours();
  loadFactor += getDepartureModifier(hour);

  // Deterministic jitter
  loadFactor += jitterFromId(flight.id);

  // Clamp
  loadFactor = Math.max(0.45, Math.min(0.98, loadFactor));

  let count: number;
  let confidence: number;
  let method: string;

  if (flight.bookedPassengers !== undefined) {
    // Blend booking data with estimate
    const estimated = Math.round(totalSeats * loadFactor);
    count = Math.round(flight.bookedPassengers * 0.7 + estimated * 0.3);
    confidence = 0.88 + (jitterFromId(flight.id + "conf") + 0.03) * 0.5;
    confidence = Math.max(0.85, Math.min(0.95, confidence));
    method = "booking-data-blend";
  } else {
    count = Math.round(totalSeats * loadFactor);
    confidence = 0.75 + (jitterFromId(flight.id + "conf") + 0.03) * 0.5;
    confidence = Math.max(0.72, Math.min(0.82, confidence));
    method = "historical-seasonal";
  }

  return { count: Math.max(0, count), confidenceLevel: confidence, method };
}
