import { Request, Response, NextFunction } from "express";
import * as analyticsServices from "../services/analyticsServices";

export async function dashboardKpis(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, status } = req.query;
    const kpis = await analyticsServices.getDashboardKpis({
      type: type as string,
      status: status as string,
    });
    res.json({ success: true, data: kpis });
  } catch (err) {
    next(err);
  }
}

export async function fuelEfficiency(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsServices.getFuelEfficiency();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function operationalCost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsServices.getOperationalCost();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function utilization(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsServices.getFleetUtilization();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
