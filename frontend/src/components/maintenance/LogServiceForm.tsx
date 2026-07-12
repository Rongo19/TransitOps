import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVehicles } from "../../api/vehicle";
import { useCreateMaintenanceLog } from "../../api/maintenance";

const logSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  serviceType: z.string().min(1, "Service type is required"),
  cost: z.coerce.number().nonnegative("Enter a valid cost"),
  date: z.string().min(1, "Date is required"),
});

// Input = what the form fields actually hold (cost can be string before coercion)
type LogFormInput = z.input<typeof logSchema>;
// Output = what you get after validation/coercion (cost is guaranteed number)
type LogFormOutput = z.output<typeof logSchema>;

export function LogServiceForm() {
  const { data: vehicles } = useVehicles();
  const createLog = useCreateMaintenanceLog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogFormInput>({ resolver: zodResolver(logSchema) });

  const eligibleVehicles = vehicles?.filter((v) => v.status !== "RETIRED") ?? [];

  const onSubmit = async (data: LogFormOutput) => {
    await createLog.mutateAsync(data);
    reset();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-[380px] shrink-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Log service record
      </h3>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-3">
        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Vehicle</label>
          <select
            {...register("vehicleId")}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select vehicle</option>
            {eligibleVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-xs text-red-600 mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Service type</label>
          <input
            {...register("serviceType")}
            placeholder="Oil Change"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.serviceType && (
            <p className="text-xs text-red-600 mt-1">{errors.serviceType.message}</p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Cost</label>
          <input
            {...register("cost")}
            type="number"
            placeholder="2500"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.cost && <p className="text-xs text-red-600 mt-1">{errors.cost.message}</p>}
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Date</label>
          <input
            {...register("date")}
            type="date"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
        </div>

        <button
          type="submit"
          disabled={createLog.isPending}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-md disabled:opacity-60"
        >
          {createLog.isPending ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}