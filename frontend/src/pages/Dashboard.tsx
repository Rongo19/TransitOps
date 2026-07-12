import { KpiCard } from "../components/dashboard/KpiCard";

const kpis = [
  { label: "Active Vehicles", value: 53, accent: "blue" as const },
  { label: "Available Vehicles", value: 42, accent: "green" as const },
  { label: "Vehicles in Maintenance", value: "05", accent: "amber" as const },
  { label: "Active Trips", value: 18, accent: "blue" as const },
  { label: "Pending Trips", value: "09", accent: "blue" as const },
  { label: "Drivers on Duty", value: 26, accent: "blue" as const },
  { label: "Fleet Utilization", value: "81%", accent: "green" as const },
];

const recentTrips = [
  { code: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", eta: "45 min" },
  { code: "TR002", vehicle: "TRK-12", driver: "John", status: "Completed", eta: "—" },
  { code: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", eta: "1h 10m" },
  { code: "TR006", vehicle: "—", driver: "—", status: "Draft", eta: "Awaiting vehicle" },
];

const statusStyles: Record<string, string> = {
  "On Trip": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Dispatched: "bg-blue-100 text-blue-800",
  Draft: "bg-gray-100 text-gray-700",
};

const vehicleStatusBars = [
  { label: "Available", pct: 72, color: "bg-green-600" },
  { label: "On Trip", pct: 31, color: "bg-blue-500" },
  { label: "In Shop", pct: 9, color: "bg-amber-500" },
  { label: "Retired", pct: 5, color: "bg-red-600" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-medium text-gray-400 uppercase">Filters</span>
        {["Vehicle Type: All", "Status: All", "Region: All"].map((f) => (
          <button
            key={f}
            className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700 flex items-center gap-1"
          >
            {f} <span className="text-gray-400">▾</span>
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent trips */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent trips</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-[10px]">
                <th className="pb-2 font-medium">Trip</th>
                <th className="pb-2 font-medium">Vehicle</th>
                <th className="pb-2 font-medium">Driver</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((t) => (
                <tr key={t.code} className="border-t border-gray-100">
                  <td className="py-2 font-medium text-gray-800">{t.code}</td>
                  <td className="py-2 text-gray-600">{t.vehicle}</td>
                  <td className="py-2 text-gray-600">{t.driver}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${statusStyles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{t.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vehicle status */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Vehicle status</h3>
          <div className="space-y-3">
            {vehicleStatusBars.map((v) => (
              <div key={v.label}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{v.label}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${v.color}`} style={{ width: `${v.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
