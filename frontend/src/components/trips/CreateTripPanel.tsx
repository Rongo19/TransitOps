import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVehicles } from "../../api/vehicle";
import { useDrivers } from "../../api/drivers";
import { useCreateTrip, useDispatchTrip } from "../../api/trips";

const tripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleId: z.string().min(1, "Select a vehicle"),
  driverId: z.string().min(1, "Select a driver"),
  cargoWeight: z
    .string()
    .trim()
    .min(1, "Enter cargo weight")
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, "Enter cargo weight"),
  plannedDistance: z
    .string()
    .trim()
    .min(1, "Enter planned distance")
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, "Enter planned distance"),
});

type TripForm = {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: string;
  plannedDistance: string;
};
type TripPayload = {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
};

export function CreateTripPanel() {
  const { data: vehicles } = useVehicles({ status: "AVAILABLE" });
  const { data: drivers } = useDrivers({ status: "AVAILABLE" });
  const createTrip = useCreateTrip();
  const dispatchTrip = useDispatchTrip();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TripForm>({ resolver: zodResolver(tripSchema) });

  const selectedVehicleId = watch("vehicleId");
  const cargoWeight = watch("cargoWeight");
  const selectedVehicle = vehicles?.find((v) => v.id === selectedVehicleId);

  const capacityExceeded =
    selectedVehicle && cargoWeight && Number(cargoWeight) > selectedVehicle.maxLoadCapacity;

  const isBusy = createTrip.isPending || dispatchTrip.isPending;

  const onSubmit = async (data: TripForm) => {
    if (capacityExceeded) return; // guarded by disabled button too, belt and suspenders
    const payload: TripPayload = {
      ...data,
      cargoWeight: Number(data.cargoWeight),
      plannedDistance: Number(data.plannedDistance),
    };
    const trip = await createTrip.mutateAsync(payload);
    await dispatchTrip.mutateAsync(trip.id);
    reset();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-[380px] shrink-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Create trip
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Source</label>
          <input
            {...register("source")}
            placeholder="Gandhinagar Depot"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.source && <p className="text-xs text-red-600 mt-1">{errors.source.message}</p>}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Destination</label>
          <input
            {...register("destination")}
            placeholder="Ahmedabad Hub"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.destination && (
            <p className="text-xs text-red-600 mt-1">{errors.destination.message}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">
            Vehicle (available only)
          </label>
          <select
            {...register("vehicleId")}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select vehicle</option>
            {vehicles?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} - {v.maxLoadCapacity} kg capacity
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-xs text-red-600 mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">
            Driver (available only)
          </label>
          <select
            {...register("driverId")}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select driver</option>
            {drivers?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.driverId && (
            <p className="text-xs text-red-600 mt-1">{errors.driverId.message}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Cargo weight (kg)</label>
          <input
            {...register("cargoWeight")}
            type="number"
            placeholder="700"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.cargoWeight && (
            <p className="text-xs text-red-600 mt-1">{errors.cargoWeight.message}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">
            Planned distance (km)
          </label>
          <input
            {...register("plannedDistance")}
            type="number"
            placeholder="38"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.plannedDistance && (
            <p className="text-xs text-red-600 mt-1">{errors.plannedDistance.message}</p>
          )}
        </div>

        {capacityExceeded && (
          <div className="bg-red-50 rounded-md p-3 space-y-1">
            <p className="text-xs text-gray-700">Vehicle capacity: {selectedVehicle!.maxLoadCapacity} kg</p>
            <p className="text-xs text-gray-700">Cargo weight: {cargoWeight} kg</p>
            <p className="text-xs text-red-700 font-medium">
              ❌ Capacity exceeded by {Number(cargoWeight) - selectedVehicle!.maxLoadCapacity} kg —
              dispatch blocked
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={!!capacityExceeded || isBusy}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              capacityExceeded || isBusy
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isBusy ? "Dispatching..." : capacityExceeded ? "Dispatch (disabled)" : "Create & dispatch"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-md text-sm text-gray-600 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

