import { Router } from "express";
import { login, me } from "../controllers/authController";
import { seedUser } from "../controllers/seedController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/seed", seedUser);

export default router;
