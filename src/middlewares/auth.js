import { verifyAccessToken } from "../utils/token.js";
import { ApiError } from "../utils/apiError.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid authorization token"));
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Token is invalid or expired"));
  }
};
