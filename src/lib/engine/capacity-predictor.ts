import { AircraftProfile, Route, Flight, PassengerEstimate, BaggageEstimate, AvailableCargo } from "@/types";
import { AVG_PASSENGER_WEIGHT_KG, FUEL_RESERVE_FACTOR } from "@/lib/utils/constants";

export function predictCapacity(
  aircraft: AircraftProfile,
  route: Route,
  flight: Flight,
  passengerEstimate: PassengerEstimate,
  baggageEstimate: BaggageEstimate
): AvailableCargo {
  // Fuel required (with reserve)
  const flightHours = route.flightDurationMin / 60;
  const fuelRequired = aircraft.fuelBurnKgPerHour * flightHours * FUEL_RESERVE_FACTOR;

  // Passenger weight (EASA standard)
  const passengerWeight = passengerEstimate.count * AVG_PASSENGER_WEIGHT_KG;

  // Available payload for cargo
  const availablePayload =
    aircraft.maxTakeoffWeightKg -
    aircraft.operatingEmptyWeightKg -
    fuelRequired -
    passengerWeight -
    baggageEstimate.totalWeightKg;

  // Structural limit of the hold
  const structuralLimit = aircraft.cargoHold.totalWeightLimitKg;

  // Weight available for cargo = min of payload limit and structural limit, minus baggage already in hold
  const baggageInHold = baggageEstimate.totalWeightKg;
  const weightFromPayload = Math.max(0, availablePayload);
  const weightFromStructural = Math.max(0, structuralLimit - baggageInHold);
  const weightKg = Math.min(weightFromPayload, weightFromStructural);

  // Volume available
  const volumeM3 = Math.max(
    0,
    aircraft.cargoHold.totalVolumeM3 - baggageEstimate.totalVolumeM3
  );

  // Confidence combines passenger confidence and baggage uncertainty
  const confidenceLevel =
    passengerEstimate.confidenceLevel * (1 - baggageEstimate.uncertaintyMarginPct * 0.5);

  // Confidence band
  const margin = baggageEstimate.uncertaintyMarginPct;
  const lowWeightKg = Math.max(0, weightKg * (1 - margin));
  const highWeightKg = weightKg * (1 + margin);
  const lowVolumeM3 = Math.max(0, volumeM3 * (1 - margin));
  const highVolumeM3 = volumeM3 * (1 + margin);

  return {
    weightKg: Math.round(weightKg),
    volumeM3: parseFloat(volumeM3.toFixed(1)),
    confidenceLevel: parseFloat(confidenceLevel.toFixed(3)),
    confidenceBand: {
      lowWeightKg: Math.round(lowWeightKg),
      highWeightKg: Math.round(highWeightKg),
      lowVolumeM3: parseFloat(lowVolumeM3.toFixed(1)),
      highVolumeM3: parseFloat(highVolumeM3.toFixed(1)),
    },
  };
}
