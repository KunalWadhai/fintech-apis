import { ApiError } from "../../utils/apiError.js";

const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());

export const validateRecordCreateBody = (body) => {
  const { amount, type, category, date, notes } = body || {};
  const errors = [];

  if (typeof amount !== "number" || amount < 0) errors.push("amount must be a positive number");
  if (!["income", "expense"].includes(type)) errors.push("type must be income or expense");
  if (!category || typeof category !== "string") errors.push("category is required");
  if (!date || !isValidDate(date)) errors.push("date must be valid");
  if (notes !== undefined && typeof notes !== "string") errors.push("notes must be a string");

  if (errors.length) throw new ApiError(400, "Validation failed", errors);
};

export const validateRecordUpdateBody = (body) => {
  const { amount, type, category, date, notes } = body || {};
  const errors = [];

  if (!Object.keys(body || {}).length) errors.push("At least one field is required for update");
  if (amount !== undefined && (typeof amount !== "number" || amount < 0)) errors.push("amount must be a positive number");
  if (type !== undefined && !["income", "expense"].includes(type)) errors.push("type must be income or expense");
  if (category !== undefined && typeof category !== "string") errors.push("category must be a string");
  if (date !== undefined && !isValidDate(date)) errors.push("date must be valid");
  if (notes !== undefined && typeof notes !== "string") errors.push("notes must be a string");

  if (errors.length) throw new ApiError(400, "Validation failed", errors);
};
