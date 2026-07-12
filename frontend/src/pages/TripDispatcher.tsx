import { useState } from "react";
import { useTrips } from "../api/trips";
import { CreateTripPanel } from "../components/trips/CreateTripPanel";
import { TripCard } from "../components/trips/TripCard";
import { CompleteTripModal } from "../components/trips/CompleteTripModal";
import { type Trip, type TripStatus } from "../types";

const stages: TripStatus[] = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"];

export default function TripDispatcher() {
  const { data: trips, isLoading } = useTrips();
  const [activeStage, setActiveStage] = useState<TripStatus | "ALL">("ALL");
  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null);

  const filteredTrips = trips?.filter((t) => activeStage === "ALL" || t.status === activeStage);

  return (
    <div className="flex gap-6">
      <CreateTripPanel />

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Live board</h3>
          <div className="flex gap-1 text-xs">
            {stages.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStage(activeStage === s ? "ALL" : s)}
                className={`px-2 py-1 rounded ${
                  activeStage === s ? "bg-gray-800 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p className="text-sm text-gray-400">Loading trips...</p>}
        {filteredTrips?.length === 0 && (
          <p className="text-sm text-gray-400">No trips in this stage.</p>
        )}

        <div className="space-y-3">
          {filteredTrips?.map((trip) => (
            <TripCard key={trip.id} trip={trip} onComplete={() => setCompletingTrip(trip)} />
          ))}
        </div>
      </div>

      {completingTrip && (
        <CompleteTripModal trip={completingTrip} onClose={() => setCompletingTrip(null)} />
      )}
    </div>
  );
}