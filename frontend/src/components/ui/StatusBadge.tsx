// tsx
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