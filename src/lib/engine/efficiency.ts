import { AircraftProfile, Route, AvailableCargo, EfficiencyMetrics } from "@/types";
import {
  FUEL_RESERVE_FACTOR,
  KG_CO2_PER_KG_FUEL,
  CONSERVATIVE_HOLD_BLOCK_PCT,
} from "@/lib/utils/constants";

export function calculateEfficiency(
  aircraft: AircraftProfile,
  route: Route,
  availableCargo: AvailableCargo
): EfficiencyMetrics {
  // Fuel required
  const flightHours = route.flightDurationMin / 60;
  const fuelRequired = aircraft.fuelBurnKgPerHour * flightHours * FUEL_RESERVE_FACTOR;

  // Conservative baseline: airlines only use (1 - CONSERVATIVE_HOLD_BLOCK_PCT) of hold for cargo
  const baselineCargoKg = Math.round(
    aircraft.cargoHold.totalWeightLimitKg * (1 - CONSERVATIVE_HOLD_BLOCK_PCT)
  );

  // Naulum finds more available cargo
  const naulumCargoKg = availableCargo.weightKg;
  const additionalKg = Math.max(0, naulumCargoKg - baselineCargoKg);
  const percentImprovement =
    baselineCargoKg > 0 ? additionalKg / baselineCargoKg : 0;

  // Cargo per energy unit
  const kgCargoPerKgFuel =
    fuelRequired > 0 ? naulumCargoKg / fuelRequired : 0;

  // Carbon comparison
  // Baseline: conservative cargo, same fuel burn
  const baselineCO2 = fuelRequired * KG_CO2_PER_KG_FUEL;
  // Optimized: same fuel but more cargo transported = better per-unit efficiency
  // Express as: CO2 per kg of cargo
  const baselineCO2PerKgCargo =
    baselineCargoKg > 0 ? baselineCO2 / baselineCargoKg : baselineCO2;
  const optimizedCO2Total = baselineCO2PerKgCargo * naulumCargoKg;
  // The actual saving comes from not needing a separate freighter for the additional cargo
  // Approximate: additional cargo * average freighter CO2 per kg (about 0.8 kg CO2/kg cargo for a 747F short leg)
  const avoidedFreighterCO2 = additionalKg * 0.8;
  const savingPct =
    baselineCO2 > 0 ? avoidedFreighterCO2 / baselineCO2 : 0;

  return {
    additionalCargoVsBaseline: {
      weightKg: additionalKg,
      percentImprovement: parseFloat(percentImprovement.toFixed(3)),
    },
    cargoPerEnergyUnit: {
      kgCargoPerKgFuel: parseFloat(kgCargoPerKgFuel.toFixed(4)),
    },
    carbonComparison: {
      baselineKgCO2: Math.round(baselineCO2),
      optimizedKgCO2: Math.round(baselineCO2 - avoidedFreighterCO2),
      savingPct: parseFloat(Math.min(savingPct, 0.15).toFixed(3)),
    },
  };
}
