import * as recordStore from "../../models/financialRecords/services.js";
import { ApiError } from "../../utils/apiError.js";

export const createFinancialRecord = async (payload, userId) =>
  recordStore.insertFinancialRecord({ ...payload, createdBy: userId });

export const listFinancialRecords = async ({
  type,
  category,
  startDate,
  endDate,
  page = 1,
  limit = 20,
}) => {
  const skip = (page - 1) * limit;
  const { items, total } = await recordStore.listFinancialRecordsWithTotal(
    { type, category, startDate, endDate },
    { skip, limit }
  );

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export const updateFinancialRecord = async (recordId, payload) => {
  const record = await recordStore.updateFinancialRecordById(recordId, payload);
  if (!record) throw new ApiError(404, "Financial record not found");
  return record;
};

export const deleteFinancialRecord = async (recordId) => {
  const record = await recordStore.softDeleteFinancialRecordById(recordId);
  if (!record) throw new ApiError(404, "Financial record not found");
};
