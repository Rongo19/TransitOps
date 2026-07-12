import { Trip } from "../../types";
import { StatusBadge, tripStatusColors } from "../ui/StatusBadge";
import { useCancelTrip } from "../../api/trips";

export function TripCard({ trip, onComplete }: { trip: Trip; onComplete: () => void }) {
  const cancelTrip = useCancelTrip();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm font-semibold text-gray-900">{trip.tripCode}</span>
          <p className="text-sm text-gray-600 mt-1">
            {trip.source} → {trip.destination}
          </p>
        </div>
        <span className="text-xs text-gray-500 uppercase">
          {trip.vehicle ? `${trip.vehicle.registrationNumber} / ${trip.driver?.name?.toUpperCase()}` : "Unassigned"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-3">
        <StatusBadge status={trip.status} colorMap={tripStatusColors} />
        <span className="text-xs text-gray-500">
          {trip.status === "DISPATCHED" && trip.etaMinutes ? `${trip.etaMinutes} min` : ""}
          {trip.status === "DRAFT" && !trip.driver && "Awaiting driver"}
          {trip.status === "CANCELLED" && "Vehicle went to shop"}
        </span>
      </div>

      {trip.status === "DISPATCHED" && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onComplete}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 rounded-md"
          >
            Complete
          </button>
          <button
            onClick={() => cancelTrip.mutate(trip.id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}