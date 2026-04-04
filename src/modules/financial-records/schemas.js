import Joi from "joi";

const objectId24 = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]+$/)
  .message("must be a 24-character hex id");

export const financialRecordCreateBodySchema = Joi.object({
  amount: Joi.number().min(0).required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().trim().min(1).max(120).required(),
  date: Joi.date().required(),
  notes: Joi.string().trim().max(500).allow("", null),
});

export const financialRecordUpdateBodySchema = Joi.object({
  amount: Joi.number().min(0),
  type: Joi.string().valid("income", "expense"),
  category: Joi.string().trim().min(1).max(120),
  date: Joi.date(),
  notes: Joi.string().trim().max(500).allow("", null),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

export const financialRecordIdParamSchema = Joi.object({
  recordId: objectId24.required(),
});

export const financialRecordsListQuerySchema = Joi.object({
  type: Joi.string().valid("income", "expense"),
  category: Joi.string().trim().max(120),
  startDate: Joi.date(),
  endDate: Joi.date(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
