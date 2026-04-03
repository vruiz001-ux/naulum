import { Route } from "@/types";

export const routes: Route[] = [
  // Short-haul
  { id: "FRA-LHR", origin: "FRA", originCity: "Frankfurt", destination: "LHR", destinationCity: "London", distanceKm: 660, flightDurationMin: 95, region: "short-haul", seasonalDemand: { winter: 0.74, spring: 0.80, summer: 0.88, autumn: 0.78 } },
  { id: "CDG-BCN", origin: "CDG", originCity: "Paris", destination: "BCN", destinationCity: "Barcelona", distanceKm: 830, flightDurationMin: 110, region: "short-haul", seasonalDemand: { winter: 0.68, spring: 0.82, summer: 0.94, autumn: 0.76 } },
  { id: "AMS-MUC", origin: "AMS", originCity: "Amsterdam", destination: "MUC", destinationCity: "Munich", distanceKm: 590, flightDurationMin: 85, region: "short-haul", seasonalDemand: { winter: 0.72, spring: 0.78, summer: 0.85, autumn: 0.76 } },
  { id: "IST-VIE", origin: "IST", originCity: "Istanbul", destination: "VIE", destinationCity: "Vienna", distanceKm: 1255, flightDurationMin: 155, region: "short-haul", seasonalDemand: { winter: 0.70, spring: 0.76, summer: 0.84, autumn: 0.74 } },
  // Medium-haul
  { id: "DXB-BOM", origin: "DXB", originCity: "Dubai", destination: "BOM", destinationCity: "Mumbai", distanceKm: 1930, flightDurationMin: 210, region: "medium-haul", seasonalDemand: { winter: 0.82, spring: 0.76, summer: 0.72, autumn: 0.80 } },
  { id: "FRA-DXB", origin: "FRA", originCity: "Frankfurt", destination: "DXB", destinationCity: "Dubai", distanceKm: 4830, flightDurationMin: 360, region: "medium-haul", seasonalDemand: { winter: 0.84, spring: 0.78, summer: 0.70, autumn: 0.82 } },
  { id: "LHR-JFK", origin: "LHR", originCity: "London", destination: "JFK", destinationCity: "New York", distanceKm: 5540, flightDurationMin: 450, region: "medium-haul", seasonalDemand: { winter: 0.78, spring: 0.82, summer: 0.90, autumn: 0.80 } },
  { id: "CDG-JFK", origin: "CDG", originCity: "Paris", destination: "JFK", destinationCity: "New York", distanceKm: 5830, flightDurationMin: 470, region: "medium-haul", seasonalDemand: { winter: 0.76, spring: 0.80, summer: 0.88, autumn: 0.78 } },
  { id: "IST-JED", origin: "IST", originCity: "Istanbul", destination: "JED", destinationCity: "Jeddah", distanceKm: 2520, flightDurationMin: 230, region: "medium-haul", seasonalDemand: { winter: 0.80, spring: 0.84, summer: 0.74, autumn: 0.86 } },
  // Long-haul
  { id: "SIN-LHR", origin: "SIN", originCity: "Singapore", destination: "LHR", destinationCity: "London", distanceKm: 10870, flightDurationMin: 780, region: "long-haul", seasonalDemand: { winter: 0.86, spring: 0.82, summer: 0.88, autumn: 0.84 } },
  { id: "DXB-SYD", origin: "DXB", originCity: "Dubai", destination: "SYD", destinationCity: "Sydney", distanceKm: 12050, flightDurationMin: 840, region: "long-haul", seasonalDemand: { winter: 0.80, spring: 0.78, summer: 0.74, autumn: 0.82 } },
  { id: "FRA-SIN", origin: "FRA", originCity: "Frankfurt", destination: "SIN", destinationCity: "Singapore", distanceKm: 10270, flightDurationMin: 720, region: "long-haul", seasonalDemand: { winter: 0.82, spring: 0.78, summer: 0.84, autumn: 0.80 } },
  { id: "LHR-HKG", origin: "LHR", originCity: "London", destination: "HKG", destinationCity: "Hong Kong", distanceKm: 9630, flightDurationMin: 690, region: "long-haul", seasonalDemand: { winter: 0.84, spring: 0.80, summer: 0.82, autumn: 0.86 } },
  { id: "DXB-NRT", origin: "DXB", originCity: "Dubai", destination: "NRT", destinationCity: "Tokyo", distanceKm: 7940, flightDurationMin: 600, region: "long-haul", seasonalDemand: { winter: 0.80, spring: 0.86, summer: 0.82, autumn: 0.84 } },
  { id: "SIN-SYD", origin: "SIN", originCity: "Singapore", destination: "SYD", destinationCity: "Sydney", distanceKm: 6290, flightDurationMin: 480, region: "long-haul", seasonalDemand: { winter: 0.78, spring: 0.76, summer: 0.72, autumn: 0.80 } },
];

export function getRoute(id: string): Route | undefined {
  return routes.find((r) => r.id === id);
}
