export type UserRole = "FLEET_MANAGER" | "DISPATCHER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
}

export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}

export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export interface Trip {
  id: string;
  tripCode: string;
  source: string;
  destination: string;
  vehicle?: Pick<Vehicle, "id" | "registrationNumber">;
  driver?: Pick<Driver, "id" | "name">;
  cargoWeight: number;
  plannedDistance: number;
  status: TripStatus;
  etaMinutes?: number;
}

export interface DashboardKpis {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number; // percentage
}

export type MaintenanceStatus = "ACTIVE" | "COMPLETED";

export interface MaintenanceLog {
  id: string;
  vehicle: Pick<Vehicle, "id" | "registrationNumber" | "name">;
  serviceType: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
}


