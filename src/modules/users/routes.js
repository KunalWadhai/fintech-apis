import { Router } from "express";
import { getUsers, updateUser } from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validateRequest.js";
import { userIdParamSchema, userUpdateBodySchema, usersListQuerySchema } from "./schemas.js";

const router = Router();

router.use(requireAuth, authorize(ROLES.ADMIN));
router.get("/", validateQuery(usersListQuerySchema), getUsers);
router.patch("/:userId", validateParams(userIdParamSchema), validateBody(userUpdateBodySchema), updateUser);

export default router;
