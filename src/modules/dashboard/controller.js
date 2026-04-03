import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDashboardSummary } from "./service.js";

export const getSummary = asyncHandler(async (req, res) => {
  const data = await getDashboardSummary();
  res.status(200).json({ message: "Dashboard summary fetched", data });
});
