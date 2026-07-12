import { useState } from "react";
import { type Trip } from "../../types";
import { useCompleteTrip } from "../../api/trips";

export function CompleteTripModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [finalOdometer, setFinalOdometer] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const completeTrip = useCompleteTrip();

  const submit = async () => {
    await completeTrip.mutateAsync({
      tripId: trip.id,
      finalOdometer: Number(finalOdometer),
      fuelConsumed: Number(fuelConsumed),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900">Complete trip {trip.tripCode}</h2>
        <p className="text-xs text-gray-500 mt-1">
          On complete: odometer → fuel log → expenses → vehicle & driver available
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Final odometer</label>
            <input
              type="number"
              value={finalOdometer}
              onChange={(e) => setFinalOdometer(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Fuel consumed (L)</label>
            <input
              type="number"
              value={fuelConsumed}
              onChange={(e) => setFuelConsumed(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!finalOdometer || !fuelConsumed || completeTrip.isPending}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:opacity-60"
          >
            {completeTrip.isPending ? "Saving..." : "Mark complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
