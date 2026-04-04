import { connectDatabase } from "./config/db.js";
import { connectRedis, getRedisClient } from "./config/redis.js";
import { env } from "./config/env.js";
import { initAuthRouteRateLimit } from "./middlewares/rateLimit.js";

const startServer = async () => {
  await connectDatabase();
  await connectRedis();
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
