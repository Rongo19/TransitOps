import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";

export async function seedUser(_req: Request, res: Response) {
  const email = "admin@transitops.local";
  const password = "Admin123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.json({ message: "Seed user already exists", user: { email: existing.email, role: existing.role } });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "System Admin",
      email,
      passwordHash,
      role: "FLEET_MANAGER",
    },
  });

  return res.status(201).json({
    message: "Seed user created",
    email,
    password,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
