import { prisma } from "../utils/prisma";

export async function listMaintenanceLogs() {
  return prisma.maintenanceLog.findMany({
    include: {
      vehicle: { select: { id: true, registrationNumber: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// CREATE — logs the service record AND flips the vehicle to IN_SHOP atomically.
export async function createMaintenanceLog(data: {
  vehicleId: string;
  serviceType: string;
  cost: number;
  date: string;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw { status: 404, message: "Vehicle not found" };

  if (vehicle.status === "ON_TRIP") {
    throw { status: 400, message: "Cannot log maintenance for a vehicle currently on a trip" };
  }
  if (vehicle.status === "RETIRED") {
    throw { status: 400, message: "Cannot log maintenance for a retired vehicle" };
  }

  const [log] = await prisma.$transaction([
    prisma.maintenanceLog.create({
      data: {
        vehicleId: data.vehicleId,
        serviceType: data.serviceType,
        cost: data.cost,
        date: new Date(data.date),
        status: "ACTIVE",
      },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
      },
    }),
    prisma.vehicle.update({ where: { id: data.vehicleId }, data: { status: "IN_SHOP" } }),
  ]);

  return log;
}

// CLOSE — restores the vehicle to AVAILABLE, unless it was separately marked RETIRED.
export async function closeMaintenanceLog(logId: string) {
  const log = await prisma.maintenanceLog.findUnique({
    where: { id: logId },
    include: { vehicle: true },
  });
  if (!log) throw { status: 404, message: "Maintenance log not found" };
  if (log.status !== "ACTIVE") {
    throw { status: 400, message: "This maintenance record is already closed" };
  }

  const newVehicleStatus = log.vehicle.status === "RETIRED" ? "RETIRED" : "AVAILABLE";

  const [updatedLog] = await prisma.$transaction([
    prisma.maintenanceLog.update({
      where: { id: logId },
      data: { status: "COMPLETED" },
      include: {
        vehicle: { select: { id: true, registrationNumber: true, name: true } },
      },
    }),
    prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: newVehicleStatus } }),
  ]);

  return updatedLog;
}
