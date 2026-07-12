interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
}

export function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
        colorMap[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export const vehicleStatusColors: Record<string, string> = {
  AVAILABLE: "bg-green-600 text-white",
  ON_TRIP: "bg-blue-600 text-white",
  IN_SHOP: "bg-amber-500 text-white",
  RETIRED: "bg-red-600 text-white",
};

export const tripStatusColors: Record<string, string> = {
  DRAFT: "bg-gray-400 text-white",
  DISPATCHED: "bg-blue-600 text-white",
  COMPLETED: "bg-green-600 text-white",
  CANCELLED: "bg-red-600 text-white",
};

export const driverStatusColors: Record<string, string> = {
  AVAILABLE: "bg-green-600 text-white",
  ON_TRIP: "bg-blue-600 text-white",
  OFF_DUTY: "bg-gray-400 text-white",
  SUSPENDED: "bg-red-600 text-white",
};

export function SafetyScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-600 text-white"
      : score >= 80
      ? "bg-amber-500 text-white"
      : "bg-red-600 text-white";

  return <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${color}`}>{score}%</span>;
}

export function isLicenseExpired(expiryDate: string) {
  return new Date(expiryDate) < new Date();
}