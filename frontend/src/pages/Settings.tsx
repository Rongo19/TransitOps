import { useState } from "react";

const rbacMatrix = [
  { role: "Fleet Manager", fleet: "✓", drivers: "✓", trips: "–", fuelExp: "–", analytics: "✓" },
  { role: "Dispatcher", fleet: "view", drivers: "–", trips: "✓", fuelExp: "–", analytics: "–" },
  { role: "Safety Officer", fleet: "–", drivers: "✓", trips: "view", fuelExp: "–", analytics: "–" },
  { role: "Financial Analyst", fleet: "view", drivers: "–", trips: "–", fuelExp: "✓", analytics: "✓" },
];

export default function Settings() {
  const [depotName, setDepotName] = useState("Gandhinagar Depot GJ4");
  const [currency, setCurrency] = useState("INR (Rs)");
  const [distanceUnit, setDistanceUnit] = useState("Kilometers");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // POST /settings once that endpoint exists on the backend
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* General settings */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">General</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <label className="text-[10px] font-medium text-gray-400 uppercase">Depot name</label>
            <input
              value={depotName}
              onChange={(e) => setDepotName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-gray-400 uppercase">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>INR (Rs)</option>
              <option>USD ($)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-gray-400 uppercase">Distance unit</label>
            <select
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option>Kilometers</option>
              <option>Miles</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-md disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* RBAC matrix */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Role-based access (RBAC)
        </h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-[10px] border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Fleet</th>
                <th className="px-4 py-3 font-medium">Drivers</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Fuel/Exp.</th>
                <th className="px-4 py-3 font-medium">Analytics</th>
              </tr>
            </thead>
            <tbody>
              {rbacMatrix.map((row) => (
                <tr key={row.role} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.role}</td>
                  <td className="px-4 py-3 text-gray-600">{row.fleet}</td>
                  <td className="px-4 py-3 text-gray-600">{row.drivers}</td>
                  <td className="px-4 py-3 text-gray-600">{row.trips}</td>
                  <td className="px-4 py-3 text-gray-600">{row.fuelExp}</td>
                  <td className="px-4 py-3 text-gray-600">{row.analytics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          ✓ = full access · view = read-only · – = no access. This matrix should mirror the
          `requireRole()` middleware checks on the backend exactly.
        </p>
      </div>
    </div>
  );
}
