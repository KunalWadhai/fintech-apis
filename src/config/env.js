import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 2026),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};
