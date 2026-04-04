import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { getDashboardSummary } from "./service.js";

export const getSummary = asyncHandler(async (req, res) => {
  const data = await getDashboardSummary();
  sendSuccess(res, 200, data, { message: "Dashboard summary retrieved successfully" });
});
