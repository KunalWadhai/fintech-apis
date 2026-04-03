import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createFinancialRecord,
  deleteFinancialRecord,
  listFinancialRecords,
  updateFinancialRecord,
} from "./service.js";
import {
  validateRecordCreateBody,
  validateRecordUpdateBody,
} from "./validation.js";

export const createRecord = asyncHandler(async (req, res) => {
  validateRecordCreateBody(req.body);
  const record = await createFinancialRecord(req.body, req.user.sub);
  res.status(201).json({ message: "Record created", data: record });
});

export const getRecords = asyncHandler(async (req, res) => {
  const data = await listFinancialRecords({
    type: req.query.type,
    category: req.query.category,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
  });

  res.status(200).json({ message: "Records fetched", data });
});

export const updateRecord = asyncHandler(async (req, res) => {
  validateRecordUpdateBody(req.body);
  const record = await updateFinancialRecord(req.params.recordId, req.body);
  res.status(200).json({ message: "Record updated", data: record });
});

export const removeRecord = asyncHandler(async (req, res) => {
  await deleteFinancialRecord(req.params.recordId);
  res.status(204).send();
});
