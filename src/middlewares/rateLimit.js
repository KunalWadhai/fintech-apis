import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { sendError } from "../utils/apiResponse.js";

let authRouteRateLimitImpl;

export const initAuthRouteRateLimit = (redisClient) => {
  authRouteRateLimitImpl = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: "rl:auth:",
    }),
    handler: (req, res, _next, options) => {
      sendError(res, options.statusCode ?? 429, "Too many requests. Please try again later.", {
        code: "RATE_LIMIT_EXCEEDED",
      });
    },
  });
};

export const authRouteRateLimit = (req, res, next) => {
  if (!authRouteRateLimitImpl) {
    return next(
      new Error("Rate limiter is not initialized. Ensure Redis is connected before loading routes.")
    );
  }
  return authRouteRateLimitImpl(req, res, next);
};
