import { prisma } from "../utils/prisma";

export async function listVehicles(filters: { type?: string; status?: string; search?: string }) {
  return prisma.vehicle.findMany({
    where: {
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status as any }),
      ...(filters.search && {
        registrationNumber: { contains: filters.search, mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw { status: 404, message: "Vehicle not found" };
  return vehicle;
}

export async function createVehicle(data: any) {
  return prisma.vehicle.create({ data });
}

export async function updateVehicle(id: string, data: any) {
  await getVehicleById(id); // 404s cleanly if missing
  return prisma.vehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id: string) {
  await getVehicleById(id);
  return prisma.vehicle.delete({ where: { id } });
}
