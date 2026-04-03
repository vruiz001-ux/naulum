import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { aircraftProfiles } from "@/lib/data/aircraft-profiles";
import { formatWeight, formatVolume } from "@/lib/utils/formatting";

export default function FleetPage() {
  return (
    <div>
      <Header
        title="Fleet Profiles"
        subtitle="Aircraft specifications and cargo hold configurations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {aircraftProfiles.map((ac) => {
          const totalSeats =
            ac.seatCapacity.economy + ac.seatCapacity.business + ac.seatCapacity.first;
          return (
            <Card key={ac.typeCode} className="overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4">
                <h3 className="text-lg font-bold">{ac.name}</h3>
                <Badge className="bg-sky-500/20 text-sky-300 mt-1">{ac.typeCode}</Badge>
              </div>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* Cabin */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Cabin Configuration
                    </h4>
                    <div className="flex gap-2">
                      {ac.seatCapacity.first > 0 && (
                        <Badge variant="outline" className="text-xs">
                          F: {ac.seatCapacity.first}
                        </Badge>
                      )}
                      {ac.seatCapacity.business > 0 && (
                        <Badge variant="outline" className="text-xs">
                          J: {ac.seatCapacity.business}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Y: {ac.seatCapacity.economy}
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-700 text-xs">
                        Total: {totalSeats}
                      </Badge>
                    </div>
                  </div>

                  {/* Weights */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Weights
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">MTOW</span>
                        <p className="font-medium">{formatWeight(ac.maxTakeoffWeightKg)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">OEW</span>
                        <p className="font-medium">{formatWeight(ac.operatingEmptyWeightKg)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Max Payload</span>
                        <p className="font-medium">{formatWeight(ac.maxPayloadKg)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Max Fuel</span>
                        <p className="font-medium">{formatWeight(ac.maxFuelCapacityKg)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cargo Hold */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Cargo Hold
                    </h4>
                    <div className="flex gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-slate-500">Total Weight</span>
                        <p className="font-semibold text-sky-600">
                          {formatWeight(ac.cargoHold.totalWeightLimitKg)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Total Volume</span>
                        <p className="font-semibold text-violet-600">
                          {formatVolume(ac.cargoHold.totalVolumeM3)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ac.cargoHold.compartments.map((comp) => (
                        <div
                          key={comp.id}
                          className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-slate-700">{comp.name}</span>
                          <span className="text-slate-500">
                            {formatWeight(comp.maxWeightKg)} · {formatVolume(comp.maxVolumeM3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="flex justify-between text-sm border-t pt-3">
                    <div>
                      <span className="text-slate-500">Fuel burn</span>
                      <p className="font-medium">{ac.fuelBurnKgPerHour.toLocaleString()} kg/h</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Range</span>
                      <p className="font-medium">{ac.typicalRangeKm.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
