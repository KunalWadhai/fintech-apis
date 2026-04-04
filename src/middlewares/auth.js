import { env } from "../config/env.js";
import { verifyAccessToken } from "../utils/token.js";
import { ApiError } from "../utils/apiError.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.[env.jwtCookieName];

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(new ApiError(401, "Session is invalid or expired"));
  }
};
