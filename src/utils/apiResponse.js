const statusToErrorCode = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  429: "RATE_LIMIT_EXCEEDED",
  500: "INTERNAL_SERVER_ERROR",
};

const resolveErrorCode = (statusCode, explicit) =>
  explicit ?? statusToErrorCode[statusCode] ?? "UNKNOWN_ERROR";

const buildMeta = (res, extra = {}) => ({
  timestamp: new Date().toISOString(),
  ...(res.locals?.requestId && { requestId: res.locals.requestId }),
  ...extra,
});

const normalizeErrorDetails = (details) => {
  if (details === null || details === undefined) return null;
  if (Array.isArray(details) && details.length === 0) return null;
  return details;
};

export const sendSuccess = (res, statusCode, data, options = {}) => {
  const { message = "OK", meta: userMeta = {} } = options;
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    meta: buildMeta(res, userMeta),
  });
};

export const sendError = (res, statusCode, message, options = {}) => {
  const { code, details } = options;
  const normalized = normalizeErrorDetails(details);
  const error = {
    code: resolveErrorCode(statusCode, code),
    ...(normalized != null ? { details: normalized } : {}),
  };

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error,
    meta: buildMeta(res, {}),
  });
};
