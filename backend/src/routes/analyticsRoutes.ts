import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/dashboard/kpis", analyticsController.dashboardKpis);
router.get("/analytics/fuel-efficiency", analyticsController.fuelEfficiency);
router.get("/analytics/cost", analyticsController.operationalCost);
router.get("/analytics/utilization", analyticsController.utilization);

export default router;
