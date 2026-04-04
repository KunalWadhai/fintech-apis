import Joi from "joi";
import { ROLE_VALUES } from "../../constants/roles.js";

const objectId24 = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]+$/)
  .message("must be a 24-character hex id");

export const userUpdateBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  role: Joi.string().valid(...ROLE_VALUES),
  status: Joi.string().valid("active", "inactive"),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

export const userIdParamSchema = Joi.object({
  userId: objectId24.required(),
});

export const usersListQuerySchema = Joi.object({
  role: Joi.string().valid(...ROLE_VALUES),
  status: Joi.string().valid("active", "inactive"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
