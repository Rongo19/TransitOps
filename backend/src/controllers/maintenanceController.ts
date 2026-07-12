import { Request, Response, NextFunction } from "express";
import * as maintenanceService from "../services/maintenanceService";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await maintenanceService.listMaintenanceLogs();
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await maintenanceService.createMaintenanceLog(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
}

export async function close(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await maintenanceService.closeMaintenanceLog(req.params.id);
    res.json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
}
