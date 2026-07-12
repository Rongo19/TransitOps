import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVehicles } from "../../api/vehicle";
import { useLogFuel } from "../../api/fuelExpenses";

const schema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  date: z.string().min(1, "Date is required"),
  liters: z.coerce.number().positive("Enter liters"),
  cost: z.coerce.number().positive("Enter cost"),
});
export function LogFuelModal({ onClose }: { onClose: () => void }) {
  const { data: vehicles } = useVehicles();
  const logFuel = useLogFuel();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    await logFuel.mutateAsync(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900">Log fuel</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Vehicle</label>
            <select {...register("vehicleId")} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">Select vehicle</option>
              {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            {errors.vehicleId && <p className="text-xs text-red-600 mt-1">{errors.vehicleId.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Date</label>
            <input {...register("date")} type="date" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Liters</label>
              <input {...register("liters")} type="number" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              {errors.liters && <p className="text-xs text-red-600 mt-1">{errors.liters.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Cost</label>
              <input {...register("cost")} type="number" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              {errors.cost && <p className="text-xs text-red-600 mt-1">{errors.cost.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={logFuel.isPending} className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium disabled:opacity-60">
              {logFuel.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}