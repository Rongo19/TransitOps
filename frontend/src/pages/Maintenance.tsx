import { useMaintenanceLogs, useCloseMaintenanceLog } from "../api/maintenance";
import { LogServiceForm } from "../components/maintenance/LogServiceForm";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-amber-500 text-white",
  COMPLETED: "bg-lime-600 text-white",
};

export default function Maintenance() {
  const { data: logs, isLoading } = useMaintenanceLogs();
  const closeLog = useCloseMaintenanceLog();

  return (
    <div className="flex gap-6">
      <LogServiceForm />

      <div className="flex-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Service log
        </h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-[10px] border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Loading service log...
                  </td>
                </tr>
              )}
              {logs?.map((log) => (
                <tr key={log.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{log.vehicle.name}</td>
                  <td className="px-4 py-3 text-gray-600">{log.serviceType}</td>
                  <td className="px-4 py-3 text-gray-600">₹{log.cost.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                        statusColors[log.status]
                      }`}
                    >
                      {log.status === "ACTIVE" ? "In Shop" : "Completed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {log.status === "ACTIVE" && (
                      <button
                        onClick={() => closeLog.mutate(log.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Close record
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {logs?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No maintenance records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
