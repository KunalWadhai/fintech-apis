import { ApiError } from "../utils/apiError.js";

const joiOptionsBody = {
  abortEarly: false,
  stripUnknown: true,
};

const joiOptionsQueryParams = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
};

const formatJoiDetails = (error) =>
  error.details.map((d) => d.message.replace(/"/g, ""));

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, joiOptionsBody);

  if (error) {
    return next(new ApiError(400, "Validation failed", formatJoiDetails(error)));
  }

  req.body = value;
  return next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, joiOptionsQueryParams);

  if (error) {
    return next(new ApiError(400, "Validation failed", formatJoiDetails(error)));
  }

  req.query = value;
  return next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, joiOptionsQueryParams);

  if (error) {
    return next(new ApiError(400, "Validation failed", formatJoiDetails(error)));
  }

  req.params = value;
  return next();
};
