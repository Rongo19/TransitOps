import { useState } from "react";
import { useFuelLogs, useExpenses } from "../api/fuelExpenses";
import { LogFuelModal } from "../components/fuel/LogFuelModal";
import { AddExpenseModal } from "../components/fuel/AddExpenseModal";

export default function FuelExpenses() {
  const { data: fuelLogs, isLoading: loadingFuel } = useFuelLogs();
  const { data: expenses, isLoading: loadingExpenses } = useExpenses();
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const totalFuel = (fuelLogs ?? []).reduce<number>((sum, f) => sum + f.cost, 0);
  const totalMaintenance = (expenses ?? []).reduce<number>((sum, e) => sum + e.maintenanceLinked, 0);
  const totalOperationalCost = totalFuel + totalMaintenance;

  return (
    <div className="space-y-6">
      {/* Fuel logs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fuel logs</h3>
          <button onClick={() => setShowFuelModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md">
            + Log Fuel
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-[10px] border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Liters</th>
                <th className="px-4 py-3 font-medium">Fuel cost</th>
              </tr>
            </thead>
            <tbody>
              {loadingFuel && <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>}
              {fuelLogs?.map((f) => (
                <tr key={f.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{f.vehicle.name}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(f.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3 text-gray-600">{f.liters} L</td>
                  <td className="px-4 py-3 text-gray-600">₹{f.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Other expenses (toll / misc)</h3>
          <button onClick={() => setShowExpenseModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md">
            + Add Expense
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-[10px] border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Toll</th>
                <th className="px-4 py-3 font-medium">Other</th>
                <th className="px-4 py-3 font-medium">Maint. (linked)</th>
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {loadingExpenses && <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>}
              {expenses?.map((e) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{e.trip?.tripCode ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{e.vehicle.name}</td>
                  <td className="px-4 py-3 text-gray-600">₹{e.toll}</td>
                  <td className="px-4 py-3 text-gray-600">₹{e.other}</td>
                  <td className="px-4 py-3 text-gray-600">₹{e.maintenanceLinked}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${e.status === "COMPLETED" ? "bg-lime-600 text-white" : "bg-green-600 text-white"}`}>
                      ₹{e.total.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total operational cost */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-4 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase">Total operational cost (auto) = fuel + maintenance</span>
        <span className="text-xl font-semibold text-gray-900">₹{totalOperationalCost.toLocaleString()}</span>
      </div>

      {showFuelModal && <LogFuelModal onClose={() => setShowFuelModal(false)} />}
      {showExpenseModal && <AddExpenseModal onClose={() => setShowExpenseModal(false)} />}
    </div>
  );
}
