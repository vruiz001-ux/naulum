import { Flight, PredictionResult } from "@/types";
import { getAircraftProfile } from "@/lib/data/aircraft-profiles";
import { getRoute } from "@/lib/data/routes";
import { estimatePassengers } from "./passenger-estimator";
import { estimateBaggage } from "./baggage-model";
import { predictCapacity } from "./capacity-predictor";
import { allocateCompartments } from "./compartment-loader";
import { calculateEfficiency } from "./efficiency";

export function runPrediction(flight: Flight): PredictionResult | null {
  const aircraft = getAircraftProfile(flight.aircraftType);
  const route = getRoute(flight.routeId);

  if (!aircraft || !route) return null;

  const passengerEstimate = estimatePassengers(aircraft, route, flight);
  const baggageEstimate = estimateBaggage(passengerEstimate.count, route, aircraft);
  const availableCargo = predictCapacity(aircraft, route, flight, passengerEstimate, baggageEstimate);
  const compartmentLoading = allocateCompartments(aircraft, baggageEstimate, availableCargo);
  const efficiency = calculateEfficiency(aircraft, route, availableCargo);

  return {
    flightId: flight.id,
    flight,
    route,
    aircraft,
    timestamp: new Date().toISOString(),
    passengerEstimate,
    baggageEstimate,
    availableCargo,
    compartmentLoading,
    efficiency,
  };
}
