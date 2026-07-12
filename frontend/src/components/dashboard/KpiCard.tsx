interface KpiCardProps {
  label: string;
  value: string | number;
  accent: "blue" | "green" | "amber";
}

const accentMap = {
  blue: "border-l-blue-500",
  green: "border-l-green-600",
  amber: "border-l-amber-500",
};

export function KpiCard({ label, value, accent }: KpiCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${accentMap[accent]} px-4 py-4`}>
      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
