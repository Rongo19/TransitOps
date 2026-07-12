import { Request, Response, NextFunction } from "express";
import * as fuelExpenseService from "../services/fuelExpenseService";

export async function listFuel(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await fuelExpenseService.listFuelLogs();
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export async function createFuel(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await fuelExpenseService.createFuelLog(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
}

export async function listExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const expenses = await fuelExpenseService.listExpenses();
    res.json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
}

export async function createExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await fuelExpenseService.createExpense(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}
