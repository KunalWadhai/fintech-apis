import { createClient } from "redis";
import { env } from "./env.js";

let client;

export const getRedisClient = () => {
  if (!client) {
    throw new Error("Redis client is not initialized");
  }
  return client;
};

export const connectRedis = async () => {
  client = createClient({ url: env.redisUrl });
  client.on("error", (err) => {
    console.error("Redis client error:", err.message);
  });
  await client.connect();
};
