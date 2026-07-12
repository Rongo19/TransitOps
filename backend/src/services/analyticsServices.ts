import { prisma } from "../utils/prisma";

export async function getDashboardKpis(filters: { type?: string; status?: string }) {
  const vehicleWhere = {
    ...(filters.type && { type: filters.type }),
  };

  const [
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    totalVehicles,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { ...vehicleWhere, status: { not: "RETIRED" } } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "IN_SHOP" } }),
    prisma.trip.count({ where: { status: "DISPATCHED" } }),
    prisma.trip.count({ where: { status: "DRAFT" } }),
    prisma.driver.count({ where: { status: "ON_TRIP" } }),
    prisma.vehicle.count({ where: vehicleWhere }),
  ]);

  const onTripVehicles = await prisma.vehicle.count({ where: { ...vehicleWhere, status: "ON_TRIP" } });
  const fleetUtilization = totalVehicles > 0 ? Math.round((onTripVehicles / totalVehicles) * 100) : 0;

  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization,
  };
}

export async function getFuelEfficiency() {
  const vehicles = await prisma.vehicle.findMany({
    include: { fuelLogs: true, trips: { where: { status: "COMPLETED" } } },
  });

  return vehicles.map((v) => {
    const totalFuel = v.fuelLogs.reduce((sum, f) => sum + f.liters, 0);
    const totalDistance = v.trips.reduce((sum, t) => sum + t.plannedDistance, 0);
    return {
      vehicle: v.name,
      fuelEfficiency: totalFuel > 0 ? +(totalDistance / totalFuel).toFixed(1) : 0,
    };
  });
}

export async function getOperationalCost() {
  const vehicles = await prisma.vehicle.findMany({
    include: { fuelLogs: true, maintenanceLogs: true, expenses: true },
  });

  return vehicles.map((v) => {
    const fuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const maintenanceCost = v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
    const expenseCost = v.expenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      vehicle: v.name,
      operationalCost: fuelCost + maintenanceCost + expenseCost,
    };
  });
}

export async function getFleetUtilization() {
  const total = await prisma.vehicle.count();
  const onTrip = await prisma.vehicle.count({ where: { status: "ON_TRIP" } });
  return { fleetUtilization: total > 0 ? Math.round((onTrip / total) * 100) : 0 };
}
