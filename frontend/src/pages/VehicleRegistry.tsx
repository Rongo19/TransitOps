import { useState } from "react";
import { useVehicles } from "../api/vehicles";
import { AddVehicleModal } from "../components/vehicles/AddVehicleModal";
import { StatusBadge, vehicleStatusColors } from "../components/ui/StatusBadge";

export default function VehicleRegistry() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: vehicles, isLoading, isError } = useVehicles({ type, status, search });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700"
        >
          <option value="">Type: All</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Mini">Mini</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700"
        >
          <option value="">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reg. no..."
          className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700 flex-1 max-w-xs"
        />

        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-[10px] border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Reg. no. (unique)</th>
              <th className="px-4 py-3 font-medium">Name/Model</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Capacity</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Acq. cost</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Loading vehicles...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-red-500">
                  Could not load vehicles. Check your connection to the backend.
                </td>
              </tr>
            )}
            {vehicles?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No vehicles found. Add one to get started.
                </td>
              </tr>
            )}
            {vehicles?.map((v) => (
              <tr key={v.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{v.registrationNumber}</td>
                <td className="px-4 py-3 text-gray-600">{v.name}</td>
                <td className="px-4 py-3 text-gray-600">{v.type}</td>
                <td className="px-4 py-3 text-gray-600">{v.maxLoadCapacity} kg</td>
                <td className="px-4 py-3 text-gray-600">{v.odometer.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">₹{v.acquisitionCost.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} colorMap={vehicleStatusColors} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Rule: registration number must be unique · retired/in-shop vehicles are hidden from the
        trip dispatcher.
      </p>

      {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
