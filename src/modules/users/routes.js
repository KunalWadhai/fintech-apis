import { Router } from "express";
import { getUsers, updateUser } from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.use(requireAuth, authorize(ROLES.ADMIN));
router.get("/", getUsers);
router.patch("/:userId", updateUser);

export default router;
