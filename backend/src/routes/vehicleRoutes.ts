import { Router } from "express";
import * as vehicleController from "../controllers/vehicleController";
import { validate } from "../middlewares/validate";
import { createVehicleSchema, updateVehicleSchema } from "../validators/vehicleValidators";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate); // every vehicle route requires login

router.get("/", vehicleController.list);
router.get("/:id", vehicleController.getOne);
router.post("/", validate(createVehicleSchema), vehicleController.create);
router.put("/:id", validate(updateVehicleSchema), vehicleController.update);
router.delete("/:id", vehicleController.remove);

export default router;
