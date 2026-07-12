import type { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export async function listVehicles(_req: Request, res: Response) {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return res.json({ vehicles });
}

export async function listDrivers(_req: Request, res: Response) {
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return res.json({ drivers });
}
