import { ROLE_VALUES } from "../../constants/roles.js";
import { ApiError } from "../../utils/apiError.js";

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const validateRegisterBody = (body) => {
  const { name, email, password, role, status } = body || {};
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("name must be a string with at least 2 characters");
  }

  if (!email || typeof email !== "string" || !isEmail(email)) {
    errors.push("email must be valid");
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push("password must be at least 8 characters");
  }

  if (role !== undefined && !ROLE_VALUES.includes(role)) {
    errors.push(`role must be one of: ${ROLE_VALUES.join(", ")}`);
  }

  if (status !== undefined && !["active", "inactive"].includes(status)) {
    errors.push("status must be active or inactive");
  }

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }
};

export const validateLoginBody = (body) => {
  const { email, password } = body || {};
  const errors = [];

  if (!email || typeof email !== "string" || !isEmail(email)) {
    errors.push("email must be valid");
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push("password must be at least 8 characters");
  }

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }
};
