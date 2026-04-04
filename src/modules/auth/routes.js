import { Router } from "express";
import { login, logout, me, register } from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { authRouteRateLimit } from "../../middlewares/rateLimit.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { loginBodySchema, registerBodySchema } from "./schemas.js";

const router = Router();

router.post("/register", authRouteRateLimit, validateBody(registerBodySchema), register);
router.post("/login", authRouteRateLimit, validateBody(loginBodySchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
