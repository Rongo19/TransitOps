import { prisma } from "../utils/prisma";

export async function listDrivers(filters: { status?: string; search?: string }) {
  return prisma.driver.findMany({
    where: {
      ...(filters.status && { status: filters.status as any }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { licenseNumber: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDriverById(id: string) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) throw { status: 404, message: "Driver not found" };
  return driver;
}

export async function createDriver(data: any) {
  return prisma.driver.create({
    data: { ...data, licenseExpiryDate: new Date(data.licenseExpiryDate) },
  });
}

export async function updateDriver(id: string, data: any) {
  await getDriverById(id);
  return prisma.driver.update({
    where: { id },
    data: {
      ...data,
      ...(data.licenseExpiryDate && { licenseExpiryDate: new Date(data.licenseExpiryDate) }),
    },
  });
}
