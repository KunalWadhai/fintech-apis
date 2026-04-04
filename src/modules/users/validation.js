import { ROLE_VALUES } from "../../constants/roles.js";
import { ApiError } from "../../utils/apiError.js";

export const validateUserUpdateBody = (body) => {
  const { name, role, status } = body || {};
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    errors.push("name must be a string with at least 2 characters");
  }

  if (role !== undefined && !ROLE_VALUES.includes(role)) {
    errors.push(`role must be one of: ${ROLE_VALUES.join(", ")}`);
  }

  if (status !== undefined && !["active", "inactive"].includes(status)) {
    errors.push("status must be active or inactive");
  }

  if (!Object.keys(body || {}).length) {
    errors.push("At least one field is required for update");
  }

  if (errors.length) {
    throw new ApiError(400, "Validation failed", errors);
  }
};
