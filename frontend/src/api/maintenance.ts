import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./clients";
import { type MaintenanceLog } from "../types";

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
