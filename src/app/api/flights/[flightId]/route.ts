import { getFlight } from "@/lib/data/store";
import { runPrediction } from "@/lib/engine/predict";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ flightId: string }> }
) {
  const { flightId } = await params;
  const flight = getFlight(flightId);

  if (!flight) {
    return Response.json({ error: "Flight not found" }, { status: 404 });
  }

  const prediction = runPrediction(flight);
  if (!prediction) {
    return Response.json({ error: "Unable to generate prediction" }, { status: 500 });
  }

  return Response.json(prediction);
}
