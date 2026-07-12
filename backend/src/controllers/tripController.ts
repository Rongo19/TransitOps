import { Request, Response, NextFunction } from "express";
import * as tripService from "../services/tripServices";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const trips = await tripService.listTrips();
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

export async function dispatch(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

export async function complete(req: Request, res: Response, next: NextFunction) {
  try {
    const { finalOdometer, fuelConsumed } = req.body;
    const trip = await tripService.completeTrip(req.params.id, finalOdometer, fuelConsumed);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}
