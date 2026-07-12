import { Request, Response, NextFunction } from "express";
import * as driverService from "../services/driverService";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, search } = req.query;
    const drivers = await driverService.listDrivers({
      status: status as string,
      search: search as string,
    });
    res.json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
}
