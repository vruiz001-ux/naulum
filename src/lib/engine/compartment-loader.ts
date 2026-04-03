import { AircraftProfile, BaggageEstimate, AvailableCargo, CompartmentAllocation } from "@/types";

export function allocateCompartments(
  aircraft: AircraftProfile,
  baggageEstimate: BaggageEstimate,
  availableCargo: AvailableCargo
): CompartmentAllocation[] {
  const compartments = aircraft.cargoHold.compartments;

  // Step 1: Distribute baggage (aft-to-forward convention)
  const sorted = [...compartments].sort((a, b) => b.positionIndex - a.positionIndex);

  let remainingBagWeight = baggageEstimate.totalWeightKg;
  let remainingBagVolume = baggageEstimate.totalVolumeM3;

  const bagAlloc: Record<string, { weight: number; volume: number }> = {};
  for (const comp of sorted) {
    if (!comp.accepts.includes("baggage")) {
      bagAlloc[comp.id] = { weight: 0, volume: 0 };
      continue;
    }
    const wAlloc = Math.min(remainingBagWeight, comp.maxWeightKg * 0.85); // Leave 15% for cargo
    const vAlloc = Math.min(remainingBagVolume, comp.maxVolumeM3 * 0.85);
    const allocWeight = Math.min(wAlloc, remainingBagWeight);
    const allocVolume = Math.min(vAlloc, remainingBagVolume);
    bagAlloc[comp.id] = { weight: allocWeight, volume: allocVolume };
    remainingBagWeight = Math.max(0, remainingBagWeight - allocWeight);
    remainingBagVolume = Math.max(0, remainingBagVolume - allocVolume);
  }

  // Step 2: Distribute cargo in remaining space (forward-to-aft for CG balance)
  const forwardFirst = [...compartments].sort((a, b) => a.positionIndex - b.positionIndex);

  let remainingCargoWeight = availableCargo.weightKg;
  let remainingCargoVolume = availableCargo.volumeM3;

  const cargoAlloc: Record<string, { weight: number; volume: number }> = {};
  for (const comp of forwardFirst) {
    if (!comp.accepts.includes("cargo")) {
      cargoAlloc[comp.id] = { weight: 0, volume: 0 };
      continue;
    }
    const bag = bagAlloc[comp.id] || { weight: 0, volume: 0 };
    const freeWeight = Math.max(0, comp.maxWeightKg - bag.weight);
    const freeVolume = Math.max(0, comp.maxVolumeM3 - bag.volume);

    const wAlloc = Math.min(remainingCargoWeight, freeWeight);
    const vAlloc = Math.min(remainingCargoVolume, freeVolume);
    // Binding constraint: take the minimum ratio
    const weightRatio = freeWeight > 0 ? wAlloc / freeWeight : 0;
    const volumeRatio = freeVolume > 0 ? vAlloc / freeVolume : 0;
    const ratio = Math.min(weightRatio, volumeRatio, 1);

    const finalWeight = Math.round(freeWeight * ratio);
    const finalVolume = parseFloat((freeVolume * ratio).toFixed(1));

    cargoAlloc[comp.id] = { weight: finalWeight, volume: finalVolume };
    remainingCargoWeight = Math.max(0, remainingCargoWeight - finalWeight);
    remainingCargoVolume = Math.max(0, remainingCargoVolume - finalVolume);
  }

  // Step 3: Build result
  return compartments.map((comp) => {
    const bag = bagAlloc[comp.id] || { weight: 0, volume: 0 };
    const cargo = cargoAlloc[comp.id] || { weight: 0, volume: 0 };
    const totalWeight = bag.weight + cargo.weight;
    const totalVolume = bag.volume + cargo.volume;

    return {
      compartmentId: comp.id,
      compartmentName: comp.name,
      baggageWeightKg: Math.round(bag.weight),
      baggageVolumeM3: parseFloat(bag.volume.toFixed(1)),
      cargoWeightKg: Math.round(cargo.weight),
      cargoVolumeM3: parseFloat(cargo.volume.toFixed(1)),
      remainingWeightKg: Math.round(Math.max(0, comp.maxWeightKg - totalWeight)),
      remainingVolumeM3: parseFloat(Math.max(0, comp.maxVolumeM3 - totalVolume).toFixed(1)),
      utilizationPct: parseFloat((totalWeight / comp.maxWeightKg).toFixed(3)),
      maxWeightKg: comp.maxWeightKg,
      maxVolumeM3: comp.maxVolumeM3,
    };
  });
}
