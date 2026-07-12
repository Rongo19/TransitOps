import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err === "object" && err && "status" in err ? Number((err as any).status) : 500;
  const message = typeof err === "object" && err && "message" in err ? String((err as any).message) : "Internal server error";

  res.status(status || 500).json({ success: false, message });
};
