import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { listDrivers, listVehicles } from "../controllers/fleetController";

const router = Router();

router.get("/vehicles", authenticate, authorize("FLEET_MANAGER", "DISPATCHER"), listVehicles);
router.get("/drivers", authenticate, authorize("FLEET_MANAGER", "SAFETY_OFFICER"), listDrivers);

export default router;