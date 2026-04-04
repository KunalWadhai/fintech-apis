import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";

const baseCookieOptions = () => {
  const sameSite = env.cookieSameSite;
  const secure = isProduction || sameSite === "none";
  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
};

export const setAuthCookie = (res, token) => {
  const decoded = jwt.decode(token);
  const maxAge =
    decoded && typeof decoded.exp === "number"
      ? Math.max(0, decoded.exp * 1000 - Date.now())
      : undefined;

  res.cookie(env.jwtCookieName, token, {
    ...baseCookieOptions(),
    ...(maxAge !== undefined ? { maxAge } : {}),
  });
};

export const clearAuthCookie = (res) => {
  const opts = baseCookieOptions();
  res.clearCookie(env.jwtCookieName, {
    path: opts.path,
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
  });
};
