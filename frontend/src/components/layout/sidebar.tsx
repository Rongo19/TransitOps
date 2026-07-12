import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Fleet", path: "/vehicles" },
  { label: "Drivers", path: "/drivers" },
  { label: "Trips", path: "/trips" },
  { label: "Maintenance", path: "/maintenance" },
  { label: "Fuel & Expenses", path: "/fuel-expenses" },
  { label: "Analytics", path: "/analytics" },
  { label: "Settings", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="w-[190px] bg-gray-100 h-screen flex flex-col shrink-0">
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <span className="font-semibold text-lg text-gray-900">TransitOps</span>
      </div>
      <nav className="flex-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm mx-2 rounded-md mb-1 ${
                isActive
                  ? "bg-orange-100 text-orange-900 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
