import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((e: any) => ({ field: e.path.join("."), message: e.message })),
      });
    }
    req.body = result.data;
    next();
  };
}
