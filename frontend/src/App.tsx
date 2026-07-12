import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
<<<<<<< Updated upstream
import DriverManagement from "./pages/DriverManagement";
=======
<<<<<<< HEAD
import VehicleRegistry from "./pages/VehicleRegistry";
=======
import DriverManagement from "./pages/DriverManagement";
>>>>>>> 589d98de66c2f6ead2862b216e0fbed37e05b0ca
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
              <Route path="/drivers" element={<DriverManagement />} />
              {/* /vehicles, /trips, /maintenance, /fuel-expenses, /analytics, /settings go here as you build them */}
=======
<<<<<<< HEAD
              <Route path="/vehicles" element={<VehicleRegistry />} />
              {/* /drivers, /trips, /maintenance, /fuel-expenses, /analytics, /settings go here as you build them */}
=======
              <Route path="/drivers" element={<DriverManagement />} />
              {/* /vehicles, /trips, /maintenance, /fuel-expenses, /analytics, /settings go here as you build them */}
>>>>>>> 589d98de66c2f6ead2862b216e0fbed37e05b0ca
>>>>>>> Stashed changes
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}