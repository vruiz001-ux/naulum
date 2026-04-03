import { aircraftProfiles } from "@/lib/data/aircraft-profiles";

export async function GET() {
  return Response.json(aircraftProfiles);
}
