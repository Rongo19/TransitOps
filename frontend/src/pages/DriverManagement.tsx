import { useState } from "react";
import { useDrivers, useUpdateDriverStatus } from "../api/drivers";
import { AddDriverModal } from "../components/drivers/AddDriverModal";
import { SafetyScoreBadge, isLicenseExpired } from "../components/ui/StatusBadge";
import { type DriverStatus, type Driver } from "../types";

const toggleOptions: { status: DriverStatus; color: string }[] = [
  { status: "AVAILABLE", color: "bg-green-600" },
  { status: "ON_TRIP", color: "bg-blue-600" },
  { status: "OFF_DUTY", color: "bg-gray-500" },
  { status: "SUSPENDED", color: "bg-orange-600" },
];

export default function DriverManagement() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDriverId, setActiveDriverId] = useState<string | null>(null);

  const { data: drivers, isLoading, isError } = useDrivers({ status, search });
  const updateStatus = useUpdateDriverStatus();

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700"
        >
          <option value="">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search driver or license no..."
          className="border border-gray-200 bg-white rounded-md px-3 py-1.5 text-xs text-gray-700 flex-1 max-w-xs"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Add Driver
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-[10px] border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">License no.</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Expiry</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Trip compl.</th>
              <th className="px-4 py-3 font-medium">Safety</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  Loading drivers...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-red-500">
                  Could not load drivers. Check your connection to the backend.
                </td>
              </tr>
            )}
            {drivers?.map((d: Driver) => {
              const expired = isLicenseExpired(d.licenseExpiryDate);
              return (
                <tr
                  key={d.id}
                  className={`border-t border-gray-100 relative ${
                    activeDriverId === d.id ? "bg-orange-50" : ""
                  }`}
                  onClick={() => setActiveDriverId(activeDriverId === d.id ? null : d.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                  <td className="px-4 py-3 text-gray-600">{d.licenseNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{d.licenseCategory}</td>
                  <td className={`px-4 py-3 ${expired ? "text-red-600 font-medium" : "text-gray-600"}`}>
                    {new Date(d.licenseExpiryDate).toLocaleDateString("en-IN", {
                      month: "2-digit",
                      year: "numeric",
                    })}
                    {expired && " EXPIRED"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {d.contactNumber.replace(/(\d{5})\d{5}/, "$1xxxxx")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">96%</td>
                  <td className="px-4 py-3">
                    <SafetyScoreBadge score={d.safetyScore} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-white text-xs font-medium inline-block ${
                        toggleOptions.find((t) => t.status === d.status)?.color || "bg-gray-500"
                      }`}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                  </td>

                  {/* Inline quick-toggle row, appears on row click */}
                  {activeDriverId === d.id && (
                    <td colSpan={8} className="absolute left-0 right-0 mt-8 px-4">
                      <div className="flex gap-2 bg-white border border-gray-200 rounded-md p-2 shadow-md w-fit">
                        <span className="text-[10px] text-gray-400 uppercase self-center pr-2">
                          Toggle status
                        </span>
                        {toggleOptions.map((opt) => (
                          <button
                            key={opt.status}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus.mutate({ id: d.id, status: opt.status });
                              setActiveDriverId(null);
                            }}
                            className={`${opt.color} text-white text-xs px-3 py-1 rounded-md`}
                          >
                            {opt.status.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Rule: expired license or suspended status → blocked from trip assignment.
      </p>

      {showAddModal && <AddDriverModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
