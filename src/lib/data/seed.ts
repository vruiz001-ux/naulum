import { Flight, Season } from "@/types";
import { aircraftProfiles } from "./aircraft-profiles";
import { routes } from "./routes";

// Mulberry32 seeded PRNG
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash;
}

function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// Map routes to appropriate aircraft types
const routeAircraftMap: Record<string, string[]> = {
  "short-haul": ["A320", "B737-800"],
  "medium-haul": ["A330-300", "B787-9"],
  "long-haul": ["B777-300ER", "B787-9", "A330-300"],
};

// Flight number counter
let flightCounter = 100;

export function generateFlightSchedule(days: number = 7): Flight[] {
  const flights: Flight[] = [];
  const baseDate = new Date("2026-04-14T00:00:00Z"); // Start from a Monday
  const rng = mulberry32(42); // Fixed seed for deterministic output

  for (let day = 0; day < days; day++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + day);
    const dayOfWeek = date.getDay();
    const month = date.getMonth() + 1;
    const season = getSeason(month);

    for (const route of routes) {
      // 1-3 flights per route per day depending on region
      const flightsPerDay = route.region === "short-haul" ? 2 + Math.floor(rng() * 2)
        : route.region === "medium-haul" ? 1 + Math.floor(rng() * 2)
        : 1;

      for (let f = 0; f < flightsPerDay; f++) {
        const aircraftOptions = routeAircraftMap[route.region];
        const aircraftType = aircraftOptions[Math.floor(rng() * aircraftOptions.length)];

        // Departure hour: spread across the day
        const baseHour = route.region === "long-haul"
          ? [1, 8, 14, 22][Math.floor(rng() * 4)]
          : 6 + Math.floor(rng() * 16); // 6am to 10pm
        const minute = Math.floor(rng() * 4) * 15; // 0, 15, 30, 45

        const departure = new Date(date);
        departure.setHours(baseHour, minute, 0, 0);

        const arrival = new Date(departure);
        arrival.setMinutes(arrival.getMinutes() + route.flightDurationMin);

        const flightNum = `NL ${flightCounter++}`;
        const flightId = `${flightNum.replace(" ", "")}-${date.toISOString().slice(0, 10)}`;

        // Determine status based on date relative to "today"
        const today = new Date("2026-04-16T12:00:00Z"); // Simulate "now" as mid-schedule
        const status = departure < today ? "departed" : "scheduled";

        // Some flights have booking data (closer to departure)
        const hoursUntilDeparture = (departure.getTime() - today.getTime()) / 3600000;
        const aircraft = aircraftProfiles.find(a => a.typeCode === aircraftType)!;
        const totalSeats = aircraft.seatCapacity.economy + aircraft.seatCapacity.business + aircraft.seatCapacity.first;

        let bookedPassengers: number | undefined;
        if (hoursUntilDeparture < 48 && hoursUntilDeparture > 0) {
          // Near-term flights have booking data
          const loadFactor = 0.7 + rng() * 0.25;
          bookedPassengers = Math.round(totalSeats * loadFactor);
        }

        flights.push({
          id: flightId,
          flightNumber: flightNum,
          routeId: route.id,
          aircraftType,
          departureTime: departure.toISOString(),
          arrivalTime: arrival.toISOString(),
          dayOfWeek,
          season,
          bookedPassengers,
          status,
        });
      }
    }
  }

  return flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}
