import { AircraftProfile } from "@/types";

export const aircraftProfiles: AircraftProfile[] = [
  {
    typeCode: "A320",
    name: "Airbus A320-200",
    seatCapacity: { economy: 150, business: 12, first: 0 },
    maxTakeoffWeightKg: 78000,
    operatingEmptyWeightKg: 42600,
    maxPayloadKg: 16600,
    maxFuelCapacityKg: 18730,
    cargoHold: {
      totalVolumeM3: 37.4,
      totalWeightLimitKg: 5190,
      compartments: [
        { id: "FWD", name: "Forward Hold", positionIndex: 0, maxWeightKg: 2268, maxVolumeM3: 15.8, accepts: ["baggage", "cargo", "mail"] },
        { id: "AFT", name: "Aft Hold", positionIndex: 2, maxWeightKg: 2268, maxVolumeM3: 17.6, accepts: ["baggage", "cargo"] },
        { id: "BULK", name: "Bulk Hold", positionIndex: 3, maxWeightKg: 654, maxVolumeM3: 4.0, accepts: ["baggage", "mail"] },
      ],
    },
    fuelBurnKgPerHour: 2500,
    typicalRangeKm: 6100,
  },
  {
    typeCode: "B737-800",
    name: "Boeing 737-800",
    seatCapacity: { economy: 162, business: 0, first: 0 },
    maxTakeoffWeightKg: 79016,
    operatingEmptyWeightKg: 41413,
    maxPayloadKg: 20242,
    maxFuelCapacityKg: 20894,
    cargoHold: {
      totalVolumeM3: 44.0,
      totalWeightLimitKg: 5720,
      compartments: [
        { id: "FWD", name: "Forward Hold", positionIndex: 0, maxWeightKg: 2540, maxVolumeM3: 18.4, accepts: ["baggage", "cargo", "mail"] },
        { id: "AFT", name: "Aft Hold", positionIndex: 2, maxWeightKg: 2720, maxVolumeM3: 20.6, accepts: ["baggage", "cargo"] },
        { id: "BULK", name: "Bulk Hold", positionIndex: 3, maxWeightKg: 460, maxVolumeM3: 5.0, accepts: ["baggage", "mail"] },
      ],
    },
    fuelBurnKgPerHour: 2600,
    typicalRangeKm: 5765,
  },
  {
    typeCode: "A330-300",
    name: "Airbus A330-300",
    seatCapacity: { economy: 222, business: 36, first: 0 },
    maxTakeoffWeightKg: 242000,
    operatingEmptyWeightKg: 124500,
    maxPayloadKg: 51700,
    maxFuelCapacityKg: 139090,
    cargoHold: {
      totalVolumeM3: 162.8,
      totalWeightLimitKg: 19190,
      compartments: [
        { id: "FWD", name: "Forward Hold", positionIndex: 0, maxWeightKg: 8618, maxVolumeM3: 71.3, accepts: ["baggage", "cargo", "mail"] },
        { id: "AFT", name: "Aft Hold", positionIndex: 2, maxWeightKg: 8618, maxVolumeM3: 73.3, accepts: ["baggage", "cargo"] },
        { id: "BULK", name: "Bulk Hold", positionIndex: 3, maxWeightKg: 1954, maxVolumeM3: 18.2, accepts: ["baggage", "mail"] },
      ],
    },
    fuelBurnKgPerHour: 5800,
    typicalRangeKm: 11750,
  },
  {
    typeCode: "B777-300ER",
    name: "Boeing 777-300ER",
    seatCapacity: { economy: 296, business: 42, first: 8 },
    maxTakeoffWeightKg: 351534,
    operatingEmptyWeightKg: 167829,
    maxPayloadKg: 69853,
    maxFuelCapacityKg: 181283,
    cargoHold: {
      totalVolumeM3: 214.0,
      totalWeightLimitKg: 23110,
      compartments: [
        { id: "FWD", name: "Forward Hold", positionIndex: 0, maxWeightKg: 10660, maxVolumeM3: 95.0, accepts: ["baggage", "cargo", "mail"] },
        { id: "AFT", name: "Aft Hold", positionIndex: 2, maxWeightKg: 10660, maxVolumeM3: 100.0, accepts: ["baggage", "cargo"] },
        { id: "BULK", name: "Bulk Hold", positionIndex: 3, maxWeightKg: 1790, maxVolumeM3: 19.0, accepts: ["baggage", "mail"] },
      ],
    },
    fuelBurnKgPerHour: 7800,
    typicalRangeKm: 13650,
  },
  {
    typeCode: "B787-9",
    name: "Boeing 787-9 Dreamliner",
    seatCapacity: { economy: 218, business: 28, first: 0 },
    maxTakeoffWeightKg: 254011,
    operatingEmptyWeightKg: 128850,
    maxPayloadKg: 52300,
    maxFuelCapacityKg: 101323,
    cargoHold: {
      totalVolumeM3: 148.6,
      totalWeightLimitKg: 17010,
      compartments: [
        { id: "FWD", name: "Forward Hold", positionIndex: 0, maxWeightKg: 7620, maxVolumeM3: 65.0, accepts: ["baggage", "cargo", "mail"] },
        { id: "AFT", name: "Aft Hold", positionIndex: 2, maxWeightKg: 7620, maxVolumeM3: 66.6, accepts: ["baggage", "cargo"] },
        { id: "BULK", name: "Bulk Hold", positionIndex: 3, maxWeightKg: 1770, maxVolumeM3: 17.0, accepts: ["baggage", "mail"] },
      ],
    },
    fuelBurnKgPerHour: 5400,
    typicalRangeKm: 14140,
  },
];

export function getAircraftProfile(typeCode: string): AircraftProfile | undefined {
  return aircraftProfiles.find((a) => a.typeCode === typeCode);
}
