import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "transitops-dev-secret";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
}
