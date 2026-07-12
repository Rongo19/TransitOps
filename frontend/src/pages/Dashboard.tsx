// src/pages/Dashboard.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/clients";
import { KpiCard } from "../components/dashboard/KpiCard";
import { useTrips } from "../api/trips";

function useDashboardKpis(filters: { type: string; status: string; region: string }) {
  return useQuery({
    queryKey: ["dashboard-kpis", filters],
    queryFn: async () => (await apiClient.get("/dashboard/kpis", { params: filters })).data.data,
  });
}

export default function Dashboard() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [region, setRegion] = useState("");

  const { data: kpiData, isLoading, isError } = useDashboardKpis({ type, status, region });
  const { data: trips } = useTrips();

  const kpis = kpiData
    ? [
        { label: "Active Vehicles", value: kpiData.activeVehicles, accent: "blue" as const },
        { label: "Available Vehicles", value: kpiData.availableVehicles, accent: "green" as const },
        { label: "Vehicles in Maintenance", value: kpiData.vehiclesInMaintenance, accent: "amber" as const },
        { label: "Active Trips", value: kpiData.activeTrips, accent: "blue" as const },
        { label: "Pending Trips", value: kpiData.pendingTrips, accent: "blue" as const },
        { label: "Drivers on Duty", value: kpiData.driversOnDuty, accent: "blue" as const },
        { label: "Fleet Utilization", value: `${kpiData.fleetUtilization}%`, accent: "green" as const },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Filters — now actually wired to state and refetching */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-medium text-gray-400 uppercase">Filters</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700">
          <option value="">Vehicle Type: All</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Mini">Mini</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700">
          <option value="">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
        </select>
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region: All"
          className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700 w-32"
        />
      </div>

      {isLoading && <p className="text-sm text-gray-400">Loading dashboard...</p>}
      {isError && <p className="text-sm text-red-500">Could not load KPIs — backend endpoint not built yet (B7).</p>}

      <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent trips</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-[10px]">
              <th className="pb-2 font-medium">Trip</th>
              <th className="pb-2 font-medium">Vehicle</th>
              <th className="pb-2 font-medium">Driver</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips?.slice(0, 5).map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="py-2 font-medium text-gray-800">{t.tripCode}</td>
                <td className="py-2 text-gray-600">{t.vehicle?.registrationNumber ?? "—"}</td>
                <td className="py-2 text-gray-600">{t.driver?.name ?? "—"}</td>
                <td className="py-2 text-gray-600">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}