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
  const result = await listFinancialRecords({
    type: req.query.type,
    category: req.query.category,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    page: req.query.page,
    limit: req.query.limit,
  });

  sendSuccess(res, 200, { items: result.items }, {
    message: "Financial records retrieved successfully",
    meta: { pagination: result.pagination },
  });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await updateFinancialRecord(req.params.recordId, req.body);
  sendSuccess(res, 200, record, { message: "Financial record updated successfully" });
});

export const removeRecord = asyncHandler(async (req, res) => {
  await deleteFinancialRecord(req.params.recordId);
  sendSuccess(res, 200, null, { message: "Financial record deleted successfully" });
});
