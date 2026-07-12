import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

interface AnalyticsSummary {
  fuelEfficiency: number; // km/l
  fleetUtilization: number; // %
  operationalCost: number;
  vehicleROI: number; // %
  monthlyRevenue: { month: string; revenue: number }[];
  topCostliestVehicles: { vehicle: string; cost: number; maxCost: number }[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const [eff, util, cost] = await Promise.all([
        apiClient.get("/analytics/fuel-efficiency"),
        apiClient.get("/analytics/utilization"),
        apiClient.get("/analytics/cost"),
      ]);
      return { ...eff.data.data, ...util.data.data, ...cost.data.data } as AnalyticsSummary;
    },
  });
}

export function exportCsv() {
  window.open(${import.meta.env.VITE_API_URL}/reports/export?format=csv, "_blank");
}