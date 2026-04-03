import { Route, BaggageEstimate, AircraftProfile } from "@/types";
import { BAGGAGE_CONFIG, PREMIUM_BAGGAGE_WEIGHT_MODIFIER } from "@/lib/utils/constants";

export function estimateBaggage(
  passengerCount: number,
  route: Route,
  aircraft: AircraftProfile
): BaggageEstimate {
  const config = BAGGAGE_CONFIG[route.region];

  const totalSeats =
    aircraft.seatCapacity.economy +
    aircraft.seatCapacity.business +
    aircraft.seatCapacity.first;
  const premiumRatio =
    (aircraft.seatCapacity.business + aircraft.seatCapacity.first) / totalSeats;

  // Average weight per bag considering premium passengers carry heavier bags
  const avgWeightPerBag =
    config.avgWeightKg * (1 + premiumRatio * (PREMIUM_BAGGAGE_WEIGHT_MODIFIER - 1));

  const totalPieces = Math.round(passengerCount * config.bagsPerPax);
  const totalWeightKg = Math.round(totalPieces * avgWeightPerBag);
  const totalVolumeM3 = parseFloat((totalPieces * config.avgVolumeM3).toFixed(1));

  // Uncertainty: 6% for near-term, 12% for longer out
  const uncertaintyMarginPct = route.region === "short-haul" ? 0.08 : route.region === "medium-haul" ? 0.10 : 0.12;

  return {
    totalPieces,
    totalWeightKg,
    totalVolumeM3,
    avgWeightPerBagKg: parseFloat(avgWeightPerBag.toFixed(1)),
    avgVolumePerBagM3: config.avgVolumeM3,
    uncertaintyMarginPct,
  };
}
