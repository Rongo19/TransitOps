import { Router } from "express";
import * as tripController from "../controllers/tripController";
import { validate } from "../middlewares/validate";
import { createTripSchema, completeTripSchema } from "../validators/tripValidators";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/", tripController.list);
router.post("/", validate(createTripSchema), tripController.create);
router.patch("/:id/dispatch", tripController.dispatch);
router.patch("/:id/complete", validate(completeTripSchema), tripController.complete);
router.patch("/:id/cancel", tripController.cancel);

export default router;
