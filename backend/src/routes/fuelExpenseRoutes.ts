import { Router } from "express";
import * as fuelExpenseController from "../controllers/fuelExpenseController";
import { validate } from "../middlewares/validate";
import { createFuelLogSchema, createExpenseSchema } from "../validators/fuelExpenseValidators";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/fuel-logs", fuelExpenseController.listFuel);
router.post("/fuel-logs", validate(createFuelLogSchema), fuelExpenseController.createFuel);
router.get("/expenses", fuelExpenseController.listExpenses);
router.post("/expenses", validate(createExpenseSchema), fuelExpenseController.createExpense);

export default router;
