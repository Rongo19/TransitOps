import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { Trip } from "../types";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Trip[] }>("/trips");
      return res.data.data;
    },
    refetchInterval: 8000, // live board feel
  });
}

interface CreateTripPayload {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTripPayload) => {
      const res = await apiClient.post<{ data: Trip }>("/trips", payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useDispatchTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripId: string) => {
      const res = await apiClient.patch<{ data: Trip }>(`/trips/${tripId}/dispatch`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}

export function useCompleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tripId,
      finalOdometer,
      fuelConsumed,
    }: {
      tripId: string;
      finalOdometer: number;
      fuelConsumed: number;
    }) => {
      const res = await apiClient.patch<{ data: Trip }>(`/trips/${tripId}/complete`, {
        finalOdometer,
        fuelConsumed,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripId: string) => {
      const res = await apiClient.patch<{ data: Trip }>(`/trips/${tripId}/cancel`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}
