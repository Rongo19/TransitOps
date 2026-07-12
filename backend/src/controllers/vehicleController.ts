import { Request, Response, NextFunction } from "express";
import * as vehicleService from "../services/vehicleService";

// GET /api/vehicles
export async function list(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type, status, search } = req.query;

    const vehicles = await vehicleService.listVehicles({
      type: type as string,
      status: status as string,
      search: search as string,
    });

    res.json({
      success: true,
      data: vehicles,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/vehicles/:id
export async function getOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;

    const vehicle = await vehicleService.getVehicleById(id);

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/vehicles
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/vehicles/:id
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;

    const vehicle = await vehicleService.updateVehicle(id, req.body);

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/vehicles/:id
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;

    await vehicleService.deleteVehicle(id);

    res.json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
}