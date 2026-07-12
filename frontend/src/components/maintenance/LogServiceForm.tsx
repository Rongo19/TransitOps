import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMaintenanceLog } from "../../api/maintenance";

const logSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  serviceType: z.string().min(1, "Service type is required"),
  cost: z
    .string()
    .trim()
    .min(1, "Enter a cost")
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value >= 0, "Enter a valid cost"),
  date: z.string().min(1, "Select a date"),
});

type LogForm = {
  vehicleId: string;
  serviceType: string;
  cost: string;
  date: string;
};

export function LogServiceForm() {
  const createLog = useCreateMaintenanceLog();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogForm>({ resolver: zodResolver(logSchema) });

  const onSubmit = async (data: LogForm) => {
    await createLog.mutateAsync({
      ...data,
      cost: Number(data.cost),
    });
    reset();
  };

  return (
    <div className="w-[320px] shrink-0 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Log service</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
        <div>
          <label className="text-[10px] font-medium uppercase text-gray-400">Vehicle</label>
          <input
            {...register("vehicleId")}
            placeholder="Vehicle ID"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.vehicleId && <p className="mt-1 text-xs text-red-600">{errors.vehicleId.message}</p>}
        </div>
        <div>
          <label className="text-[10px] font-medium uppercase text-gray-400">Service type</label>
          <input
            {...register("serviceType")}
            placeholder="Brake service"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.serviceType && (
            <p className="mt-1 text-xs text-red-600">{errors.serviceType.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-medium uppercase text-gray-400">Cost</label>
          <input
            {...register("cost")}
            type="number"
            placeholder="1200"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.cost && <p className="mt-1 text-xs text-red-600">{errors.cost.message}</p>}
        </div>
        <div>
          <label className="text-[10px] font-medium uppercase text-gray-400">Date</label>
          <input
            {...register("date")}
            type="date"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
        </div>
        <button
          type="submit"
          disabled={createLog.isPending}
          className="w-full rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {createLog.isPending ? "Saving..." : "Save service log"}
        </button>
      </form>
    </div>
  );
}
