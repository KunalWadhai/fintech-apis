// src/lib/redis.js
import { createClient } from "redis";
import { env } from "../config/env.js";

let client = null;
let isConnecting = false;
let reconnectAttempts = 0;

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RETRY_DELAY_MS = 500;
const MAX_RETRY_DELAY_MS = 30_000;

const getRetryDelay = (attempt) => {
  const exponential = Math.min(
    BASE_RETRY_DELAY_MS * Math.pow(2, attempt),
    MAX_RETRY_DELAY_MS
  );
  const jitter = Math.random() * 0.3 * exponential; // ±30% jitter
  return Math.floor(exponential + jitter);
};

const createRedisClient = () => {
  const redisClient = createClient({
    url: env.redisUrl,

    socket: {
      connectTimeout: 10_000,        // 10s to establish connection
      keepAlive: 10_000,             // TCP keepalive every 10s
      reconnectStrategy: (attempts) => {
        if (attempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error(
            `[Redis] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`
          );
          return new Error("Redis max reconnect attempts exceeded");
        }

        reconnectAttempts = attempts;
        const delay = getRetryDelay(attempts);
        console.warn(
          `[Redis] Reconnecting... attempt ${attempts + 1}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`
        );
        return delay;
      },
    },

    // Prevent command queue from growing unbounded during outages
    disableOfflineQueue: false,
    commandsQueueMaxLength: 500,
  });

  redisClient.on("connect", () => {
    console.info("[Redis] TCP connection established");
  });

  redisClient.on("ready", () => {
    reconnectAttempts = 0;
    console.info("[Redis] Client ready — commands will be processed");
  });

  redisClient.on("reconnecting", () => {
    console.warn(`[Redis] Reconnecting (attempt ${reconnectAttempts})...`);
  });

  redisClient.on("error", (error) => {
    console.error("[Redis] Client error:", error.message);
  });

  redisClient.on("end", () => {
    console.info("[Redis] Connection closed");
  });

  return redisClient;
};

export const initializeRedis = async () => {
  if (client?.isReady) {
    console.warn("[Redis] Already connected — skipping initialization");
    return client;
  }

  if (isConnecting) {
    console.warn("[Redis] Connection already in progress");
    return;
  }

  isConnecting = true;

  try {
    client = createRedisClient();
    await client.connect();

    console.info("[Redis] Successfully initialized");
    return client;
  } catch (error) {
    console.error("[Redis] Failed to initialize:", error.message);
    client = null;
    throw error;
  } finally {
    isConnecting = false;
  }
};

export const getRedisClient = () => {
  if (!client) {
    throw new Error(
      "[Redis] Client not initialized. Call initializeRedis() at startup."
    );
  }
  if (!client.isReady) {
    throw new Error(
      "[Redis] Client not ready. It may be reconnecting — retry your operation."
    );
  }
  return client;
};

export const checkRedisHealth = async () => {
  try {
    if (!client?.isReady) {
      return { status: "unhealthy", reason: "client not ready" };
    }

    const start = Date.now();
    await client.ping();
    const latencyMs = Date.now() - start;

    return {
      status: "healthy",
      latencyMs,
      reconnectAttempts,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      reason: error.message,
    };
  }
};

export const disconnectRedis = async () => {
  if (!client) return;

  try {
    await client.quit(); 
    console.info("[Redis] Disconnected gracefully");
  } catch (error) {
    console.error("[Redis] Error during disconnect:", error.message);
    await client.disconnect();
  } finally {
    client = null;
  }
};