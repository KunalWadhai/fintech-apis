import { Router } from "express";
import { getSummary } from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.use(requireAuth);
router.get("/summary", authorize(ROLES.ANALYST, ROLES.ADMIN), getSummary);

export default router;
