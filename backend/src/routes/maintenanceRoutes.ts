import { Router } from "express";
import * as maintenanceController from "../controllers/maintenanceController";
import { validate } from "../middlewares/validate";
import { createMaintenanceSchema } from "../validators/maintenanceValidators";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/", maintenanceController.list);
router.post("/", validate(createMaintenanceSchema), maintenanceController.create);
router.patch("/:id/close", maintenanceController.close);

export default router;
