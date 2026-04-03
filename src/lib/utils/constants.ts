// EASA standard average passenger weight including hand luggage
export const AVG_PASSENGER_WEIGHT_KG = 84;

// Baggage averages by route type
export const BAGGAGE_CONFIG = {
  "short-haul": { bagsPerPax: 1.1, avgWeightKg: 13, avgVolumeM3: 0.045 },
  "medium-haul": { bagsPerPax: 1.4, avgWeightKg: 16, avgVolumeM3: 0.052 },
  "long-haul": { bagsPerPax: 1.7, avgWeightKg: 19, avgVolumeM3: 0.058 },
} as const;

// Load factor base by region (IATA industry averages)
export const BASE_LOAD_FACTOR = {
  "short-haul": 0.82,
  "medium-haul": 0.78,
  "long-haul": 0.84,
} as const;

// Day of week modifiers (0=Sunday)
export const DAY_OF_WEEK_MODIFIER: Record<number, number> = {
  0: 0.04,   // Sunday
  1: -0.02,  // Monday
  2: -0.06,  // Tuesday
  3: -0.06,  // Wednesday
  4: 0.0,    // Thursday
  5: 0.04,   // Friday
  6: 0.02,   // Saturday
};

// Departure hour modifiers
export function getDepartureModifier(hour: number): number {
  if (hour >= 5 && hour < 8) return -0.03;    // early morning
  if (hour >= 8 && hour < 12) return 0.02;    // morning peak
  if (hour >= 12 && hour < 17) return 0.0;    // midday
  if (hour >= 17 && hour < 21) return 0.02;   // evening
  return -0.08;                                // red-eye
}

// Premium class baggage modifier
export const PREMIUM_BAGGAGE_WEIGHT_MODIFIER = 1.3;

// Fuel reserve factor
export const FUEL_RESERVE_FACTOR = 1.08;

// kg CO2 per kg of jet fuel burned (Jet A-1)
export const KG_CO2_PER_KG_FUEL = 3.16;

// Conservative baseline: airlines block this % of hold for bags
export const CONSERVATIVE_HOLD_BLOCK_PCT = 0.65;

// Average cargo rate per kg (USD) by route type for revenue estimation
export const CARGO_RATE_PER_KG: Record<string, number> = {
  "short-haul": 1.8,
  "medium-haul": 2.5,
  "long-haul": 3.5,
};
