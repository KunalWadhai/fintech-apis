import { Router } from "express";
import authRoutes from "../modules/auth/routes.js";
import usersRoutes from "../modules/users/routes.js";
import financialRecordsRoutes from "../modules/financial-records/routes.js";
import dashboardRoutes from "../modules/dashboard/routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/records", financialRecordsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
