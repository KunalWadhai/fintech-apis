import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { sendError } from "../utils/apiResponse.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return sendError(res, error.statusCode, error.message, { details: error.details });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return sendError(res, 400, "Validation failed", {
      details: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return sendError(res, 400, "Invalid identifier format");
  }

  console.error(error);
  return sendError(res, 500, "Internal server error");
};
