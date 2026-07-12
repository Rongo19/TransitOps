import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DriverManagement from "./pages/DriverManagement";
import VehicleRegistry from "./pages/VehicleRegistry";
import TripDispatcher from "./pages/TripDispatcher";
import Maintenance from "./pages/Maintenance";
import FuelExpenses from "./pages/FuelExpenses";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Settings from "./pages/Settings";
import Register from "./pages/Register";


const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/drivers" element={<DriverManagement />} />
              <Route path="/vehicles" element={<VehicleRegistry />} />
              <Route path="/trips" element={<TripDispatcher />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fuel-expenses" element={<FuelExpenses />} />
              <Route path="/analytics" element={<ReportsAnalytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/register" element={<Register />} />
              {/* Add more routes here as you build them */}
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}