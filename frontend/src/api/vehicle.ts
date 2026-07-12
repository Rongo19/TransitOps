import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { Vehicle } from "../types";

export function useVehicles(filters?: { type?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Vehicle[] }>("/vehicles", { params: filters });
      return res.data.data;
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Vehicle, "id">) => {
      const res = await apiClient.post<{ data: Vehicle }>("/vehicles", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
