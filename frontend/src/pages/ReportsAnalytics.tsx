import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAnalytics, exportCsv } from "../api/analytics";

const summaryCards = (data: any) => [
  { label: "Fuel efficiency", value: ${data?.fuelEfficiency ?? "—"} km/l, accent: "border-l-blue-500" },
  { label: "Fleet utilization", value: ${data?.fleetUtilization ?? "—"}%, accent: "border-l-green-600" },
  { label: "Operational cost", value: ₹${(data?.operationalCost ?? 0).toLocaleString()}, accent: "border-l-amber-500" },
  { label: "Vehicle ROI", value: ${data?.vehicleROI ?? "—"}%, accent: "border-l-green-600" },
];

export default function ReportsAnalytics() {
  const { data, isLoading } = useAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={exportCsv} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md">
          Export CSV
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-400">Loading analytics...</p>}

      <div className="grid grid-cols-4 gap-3">
        {summaryCards(data).map((c) => (
          <div key={c.label} className={bg-white rounded-lg border border-gray-200 border-l-4 ${c.accent} px-4 py-4}>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{c.label}</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">{c.value}</div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400">ROI = (Revenue − (Maintenance + Fuel)) / Acquisition cost</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Monthly revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.monthlyRevenue ?? []}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4d84bf" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Top costliest vehicles</h3>
          <div className="space-y-3 mt-4">
            {data?.topCostliestVehicles?.map((v) => (
              <div key={v.vehicle}>
                <div className="text-xs text-gray-600 mb-1">{v.vehicle}</div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: ${(v.cost / v.maxCost) * 100}% }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}