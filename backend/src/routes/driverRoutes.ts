import { Router } from "express";
import * as driverController from "../controllers/driverController";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createDriverSchema,
  updateDriverSchema,
} from "../validators/driverValidators";

const router = Router();

// Protect all driver routes
router.use(authenticate);

// Routes
router.get("/", driverController.list);
router.get("/:id", driverController.getOne);
router.post("/", validate(createDriverSchema), driverController.create);
router.put("/:id", validate(updateDriverSchema), driverController.update);

export default router;