import { FinancialRecord } from "../../models/financialRecords/index.js";
import { ApiError } from "../../utils/apiError.js";

const buildQuery = ({ type, category, startDate, endDate }) => {
  const query = { isDeleted: false };
  if (type) query.type = type;
  if (category) query.category = category;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  return query;
};

export const createFinancialRecord = async (payload, userId) =>
  FinancialRecord.create({ ...payload, createdBy: userId });

export const listFinancialRecords = async ({
  type,
  category,
  startDate,
  endDate,
  page = 1,
  limit = 20,
}) => {
  const query = buildQuery({ type, category, startDate, endDate });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    FinancialRecord.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
    FinancialRecord.countDocuments(query),
  ]);

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
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    payload,
    { new: true, runValidators: true }
  );

  if (!record) throw new ApiError(404, "Financial record not found");
  return record;
};

export const deleteFinancialRecord = async (recordId) => {
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!record) throw new ApiError(404, "Financial record not found");
};
