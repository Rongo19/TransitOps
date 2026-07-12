import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { MaintenanceLog } from "../types";

export function useMaintenanceLogs() {
  return useQuery({
    queryKey: ["maintenance"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: MaintenanceLog[] }>("/maintenance");
      return res.data.data;
    },
  });
}

interface CreateMaintenancePayload {
  vehicleId: string;
  serviceType: string;
  cost: number;
  date: string;
}

export function useCreateMaintenanceLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMaintenancePayload) => {
      const res = await apiClient.post<{ data: MaintenanceLog }>("/maintenance", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] }); // vehicle flips to IN_SHOP
    },
  });
}

export function useCloseMaintenanceLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (logId: string) => {
      const res = await apiClient.patch<{ data: MaintenanceLog }>(`/maintenance/${logId}/close`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] }); // vehicle flips back to AVAILABLE
    },
  });
}


### 3. Log Service form — src/components/maintenance/LogServiceForm.tsx

tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVehicles } from "../../api/vehicles";
import { useCreateMaintenanceLog } from "../../api/maintenance";

const logSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  serviceType: z.string().min(1, "Service type is required"),
  cost: z.coerce.number().nonnegative("Enter a valid cost"),
  date: z.string().min(1, "Date is required"),
});

type LogForm = z.infer<typeof logSchema>;

export function LogServiceForm() {
  // any non-retired vehicle can go into maintenance, including ones currently on trip won't show —
  // keep it simple: offer AVAILABLE + ON_TRIP vehicles, exclude RETIRED
  const { data: vehicles } = useVehicles();
  const createLog = useCreateMaintenanceLog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogForm>({ resolver: zodResolver(logSchema) });

  const eligibleVehicles = vehicles?.filter((v) => v.status !== "RETIRED");

  const onSubmit = async (data: LogForm) => {
    await createLog.mutateAsync(data);
    reset();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-[380px] shrink-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Log service record
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase">Vehicle</label>
          <select
            {...register("vehicleId")}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select vehicle</option>
            {eligibleVehicles?.map((v) => (
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

      <div className="mt-5 space-y-2 text-[11px] text-gray-500">
        <p>
          <span className="font-medium text-gray-700">Available</span> → creating active record →{" "}
          <span className="font-medium text-gray-700">In Shop</span>
        </p>
        <p>
          <span className="font-medium text-gray-700">In Shop</span> → closing record (not retired) →{" "}
          <span className="font-medium text-gray-700">Available</span>
        </p>
        <p className="pt-1 border-t border-gray-100">
          Note: in-shop vehicles are removed from the dispatch pool.
        </p>
      </div>
    </div>
  );
}