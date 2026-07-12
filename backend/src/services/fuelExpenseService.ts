import { prisma } from "../utils/prisma";

export async function listFuelLogs() {
  return prisma.fuelLog.findMany({
    include: { vehicle: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  });
}

export async function createFuelLog(data: {
  vehicleId: string;
  tripId?: string;
  date: string;
  liters: number;
  cost: number;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw { status: 404, message: "Vehicle not found" };

  return prisma.fuelLog.create({
    data: {
      vehicleId: data.vehicleId,
      tripId: data.tripId,
      date: new Date(data.date),
      liters: data.liters,
      cost: data.cost,
    },
    include: { vehicle: { select: { id: true, name: true } } },
  });
}

export async function listExpenses() {
  return prisma.expense.findMany({
    include: { vehicle: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  });
}

export async function createExpense(data: {
  vehicleId: string;
  tripId?: string;
  category: string;
  amount: number;
}) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw { status: 404, message: "Vehicle not found" };

  return prisma.expense.create({
    data: {
      vehicleId: data.vehicleId,
      category: data.category,
      amount: data.amount,
      date: new Date(),
    },
    include: { vehicle: { select: { id: true, name: true } } },
  });
}
