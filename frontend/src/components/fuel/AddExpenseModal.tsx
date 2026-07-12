import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVehicles } from "../../api/vehicle";
import { useAddExpense } from "../../api/fuelExpenses";

const schema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  toll: z.coerce.number().nonnegative().default(0),
  other: z.coerce.number().nonnegative().default(0),
});
export function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const { data: vehicles } = useVehicles();
  const addExpense = useAddExpense();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    await addExpense.mutateAsync(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900">Add expense</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Vehicle</label>
            <select {...register("vehicleId")} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">Select vehicle</option>
              {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            {errors.vehicleId && <p className="text-xs text-red-600 mt-1">{errors.vehicleId.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Toll</label>
              <input {...register("toll")} type="number" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Other</label>
              <input {...register("other")} type="number" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={addExpense.isPending} className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium disabled:opacity-60">
              {addExpense.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}