import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateVehicle } from "../../api/vehicle";

const vehicleSchema = z.object({
  registrationNumber: z.string().min(3, "Registration number is required"),
  name: z.string().min(1, "Name/model is required"),
  type: z.string().min(1, "Select a vehicle type"),
  maxLoadCapacity: z
    .string()
    .trim()
    .min(1, "Capacity must be a positive number")
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, "Capacity must be a positive number"),
  odometer: z
    .string()
    .trim()
    .optional()
    .default("")
    .transform((value) => Number(value || 0))
    .refine((value) => Number.isFinite(value) && value >= 0, "Enter a valid odometer reading"),
  acquisitionCost: z
    .string()
    .trim()
    .min(1, "Enter a valid cost")
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value >= 0, "Enter a valid cost"),
});

type VehicleForm = {
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: string;
  odometer?: string;
  acquisitionCost: string;
};
type VehiclePayload = {
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
};

export function AddVehicleModel({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending, error } = useCreateVehicle();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleForm>({ resolver: zodResolver(vehicleSchema) });

  const onSubmit = async (data: VehicleForm) => {
    const payload: VehiclePayload = {
      ...data,
      maxLoadCapacity: Number(data.maxLoadCapacity),
      odometer: Number(data.odometer ?? 0),
      acquisitionCost: Number(data.acquisitionCost),
    };
    await mutateAsync({ ...payload, status: "AVAILABLE" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">Add vehicle</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Registration number</label>
            <input
              {...register("registrationNumber")}
              placeholder="GJ01AB4521"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.registrationNumber && (
              <p className="text-xs text-red-600 mt-1">{errors.registrationNumber.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Name / model</label>
            <input
              {...register("name")}
              placeholder="VAN-05"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Type</label>
              <select
                {...register("type")}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Mini">Mini</option>
              </select>
              {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Max capacity (kg)</label>
              <input
                {...register("maxLoadCapacity")}
                type="number"
                placeholder="500"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.maxLoadCapacity && (
                <p className="text-xs text-red-600 mt-1">{errors.maxLoadCapacity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Odometer</label>
              <input
                {...register("odometer")}
                type="number"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Acquisition cost</label>
              <input
                {...register("acquisitionCost")}
                type="number"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              {errors.acquisitionCost && (
                <p className="text-xs text-red-600 mt-1">{errors.acquisitionCost.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-md px-3 py-2">
              Could not save vehicle. Registration number may already exist.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
