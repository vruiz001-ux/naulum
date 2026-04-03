// Aircraft profile
export interface AircraftProfile {
  typeCode: string;              // "A320" | "A330-300" etc
  name: string;                  // "Airbus A320-200"
  seatCapacity: { economy: number; business: number; first: number };
  maxTakeoffWeightKg: number;
  operatingEmptyWeightKg: number;
  maxPayloadKg: number;
  maxFuelCapacityKg: number;
  cargoHold: {
    totalVolumeM3: number;
    totalWeightLimitKg: number;
    compartments: CompartmentDef[];
  };
  fuelBurnKgPerHour: number;
  typicalRangeKm: number;
}

export interface CompartmentDef {
  id: string;                    // "FWD" | "AFT" | "BULK"
  name: string;
  positionIndex: number;         // 0=forward, higher=aft
  maxWeightKg: number;
  maxVolumeM3: number;
  accepts: ("baggage" | "cargo" | "mail")[];
}

export type Season = "winter" | "spring" | "summer" | "autumn";

export interface Route {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  distanceKm: number;
  flightDurationMin: number;
  region: "short-haul" | "medium-haul" | "long-haul";
  seasonalDemand: Record<Season, number>;
}

export interface Flight {
  id: string;
  flightNumber: string;
  routeId: string;
  aircraftType: string;
  departureTime: string;         // ISO datetime
  arrivalTime: string;
  dayOfWeek: number;
  season: Season;
  bookedPassengers?: number;
  status: "scheduled" | "predicted" | "departed";
}

export interface PassengerEstimate {
  count: number;
  confidenceLevel: number;
  method: string;
}

export interface BaggageEstimate {
  totalPieces: number;
  totalWeightKg: number;
  totalVolumeM3: number;
  avgWeightPerBagKg: number;
  avgVolumePerBagM3: number;
  uncertaintyMarginPct: number;
}

export interface AvailableCargo {
  weightKg: number;
  volumeM3: number;
  confidenceLevel: number;
  confidenceBand: {
    lowWeightKg: number;
    highWeightKg: number;
    lowVolumeM3: number;
    highVolumeM3: number;
  };
}

export interface CompartmentAllocation {
  compartmentId: string;
  compartmentName: string;
  baggageWeightKg: number;
  baggageVolumeM3: number;
  cargoWeightKg: number;
  cargoVolumeM3: number;
  remainingWeightKg: number;
  remainingVolumeM3: number;
  utilizationPct: number;
  maxWeightKg: number;
  maxVolumeM3: number;
}

export interface EfficiencyMetrics {
  additionalCargoVsBaseline: {
    weightKg: number;
    percentImprovement: number;
  };
  cargoPerEnergyUnit: {
    kgCargoPerKgFuel: number;
  };
  carbonComparison: {
    baselineKgCO2: number;
    optimizedKgCO2: number;
    savingPct: number;
  };
}

export interface PredictionResult {
  flightId: string;
  flight: Flight;
  route: Route;
  aircraft: AircraftProfile;
  timestamp: string;
  passengerEstimate: PassengerEstimate;
  baggageEstimate: BaggageEstimate;
  availableCargo: AvailableCargo;
  compartmentLoading: CompartmentAllocation[];
  efficiency: EfficiencyMetrics;
}
