// typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { Driver, DriverStatus } from "../types";

export function useDrivers(filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["drivers", filters],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Driver[] }>("/drivers", { params: filters });
      return res.data.data;
    },
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Driver, "id">) => {
      const res = await apiClient.post<{ data: Driver }>("/drivers", payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DriverStatus }) => {
      const res = await apiClient.put<{ data: Driver }>(`/drivers/${id}`, { status });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });
}
