import { Flight } from "@/types";
import { generateFlightSchedule } from "./seed";

let cachedFlights: Flight[] | null = null;

export function getFlights(): Flight[] {
  if (!cachedFlights) {
    cachedFlights = generateFlightSchedule(7);
  }
  return cachedFlights;
}

export function getFlight(id: string): Flight | undefined {
  return getFlights().find((f) => f.id === id);
}

export function getScheduledFlights(): Flight[] {
  return getFlights().filter((f) => f.status === "scheduled");
}

export function getUpcomingFlights(limit: number = 10): Flight[] {
  return getScheduledFlights().slice(0, limit);
}
