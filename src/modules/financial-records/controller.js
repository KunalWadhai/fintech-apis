import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  createFinancialRecord,
  deleteFinancialRecord,
  listFinancialRecords,
  updateFinancialRecord,
} from "./service.js";

export const createRecord = asyncHandler(async (req, res) => {
  const record = await createFinancialRecord(req.body, req.user.sub);
  sendSuccess(res, 201, record, { message: "Financial record created successfully" });
});

export const getRecords = asyncHandler(async (req, res) => {
  const q = req.validatedQuery;
  const result = await listFinancialRecords({
    type: q.type,
    category: q.category,
    startDate: q.startDate,
    endDate: q.endDate,
    page: q.page,
    limit: q.limit,
  });

  sendSuccess(res, 200, { items: result.items }, {
    message: "Financial records retrieved successfully",
    meta: { pagination: result.pagination },
  });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await updateFinancialRecord(req.validatedParams.recordId, req.body);
  sendSuccess(res, 200, record, { message: "Financial record updated successfully" });
});

export const removeRecord = asyncHandler(async (req, res) => {
  await deleteFinancialRecord(req.validatedParams.recordId);
  sendSuccess(res, 200, null, { message: "Financial record deleted successfully" });
});
