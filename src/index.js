import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { initAuthRouteRateLimit } from "./middlewares/rateLimit.js";
import { initializeRedis, getRedisClient, disconnectRedis } from "./libs/redisClient.js";

const startServer = async () => {
  await connectDatabase();
  await initializeRedis();
  initAuthRouteRateLimit(getRedisClient());

  const { default: app } = await import("./app.js");

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
