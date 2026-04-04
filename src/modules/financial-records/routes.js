import { Router } from "express";
import {
  createRecord,
  getRecords,
  removeRecord,
  updateRecord,
} from "./controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { ROLES } from "../../constants/roles.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validateRequest.js";
import {
  financialRecordCreateBodySchema,
  financialRecordIdParamSchema,
  financialRecordUpdateBodySchema,
  financialRecordsListQuerySchema,
} from "./schemas.js";

const router = Router();

router.use(requireAuth);
router.get(
  "/",
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  validateQuery(financialRecordsListQuerySchema),
  getRecords
);
router.post("/", authorize(ROLES.ADMIN), validateBody(financialRecordCreateBodySchema), createRecord);
router.patch(
  "/:recordId",
  authorize(ROLES.ADMIN),
  validateParams(financialRecordIdParamSchema),
  validateBody(financialRecordUpdateBodySchema),
  updateRecord
);
router.delete(
  "/:recordId",
  authorize(ROLES.ADMIN),
  validateParams(financialRecordIdParamSchema),
  removeRecord
);

export default router;
