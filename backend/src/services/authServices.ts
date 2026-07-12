import { prisma } from "../utils/prisma";
import { hashPassword, comparePassword, signToken } from "../utils/auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw { status: 409, message: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role as any,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: "User not found" };
  return sanitizeUser(user);
}

function sanitizeUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}
