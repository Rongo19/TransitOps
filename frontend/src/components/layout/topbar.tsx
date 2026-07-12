import { Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Topbar() {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{user?.name ?? "Guest"}</div>
          <div className="text-xs text-gray-500">{user?.role ?? ""}</div>
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-semibold">
          {initials ?? "?"}
        </div>
      </div>
    </header>
  );
}
