import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import authRoutes from "../modules/auth/routes.js";
import usersRoutes from "../modules/users/routes.js";
import financialRecordsRoutes from "../modules/financial-records/routes.js";
import dashboardRoutes from "../modules/dashboard/routes.js";

const router = Router();

router.get("/health", (req, res) => {
  sendSuccess(res, 200, { status: "up" }, { message: "Service is healthy" });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/records", financialRecordsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
