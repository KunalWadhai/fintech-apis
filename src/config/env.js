import dotenv from "dotenv";

dotenv.config();

const parseTrustedOrigins = () => {
  const raw = process.env.TRUSTED_ORIGINS;
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"];
};

const normalizeSameSite = (value) => {
  const v = String(value || "lax").toLowerCase();
  if (v === "none" || v === "strict" || v === "lax") return v;
  return "lax";
};

export const env = {
  port: Number(process.env.PORT || 2026),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  nodeEnv: process.env.NODE_ENV || "development",
  trustedOrigins: parseTrustedOrigins(),
  jwtCookieName: process.env.JWT_COOKIE_NAME || "access_token",
  cookieSameSite: normalizeSameSite(process.env.COOKIE_SAMESITE),
  trustProxy: process.env.TRUST_PROXY === "true" || process.env.TRUST_PROXY === "1",
};

export const isProduction = env.nodeEnv === "production";
