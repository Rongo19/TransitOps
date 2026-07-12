import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./clients";
import type { FuelLog, Expense } from "../types";

export function useFuelLogs() {
  return useQuery({
    queryKey: ["fuel-logs"],
    queryFn: async () => (await apiClient.get<{ data: FuelLog[] }>("/fuel-logs")).data.data,
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await apiClient.get<{ data: Expense[] }>("/expenses")).data.data,
  });
}

export function useLogFuel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { vehicleId: string; date: string; liters: number; cost: number }) =>
      (await apiClient.post("/fuel-logs", payload)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fuel-logs"] }),
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      vehicleId: string;
      tripId?: string;
      toll: number;
      other: number;
    }) => (await apiClient.post("/expenses", payload)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}