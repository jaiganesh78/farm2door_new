import Redis from "ioredis";
import logger from "../utils/logger.js";

let redis = null;

const redisUrl = process.env.REDIS_URL;

if (redisUrl && redisUrl.trim() !== "") {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null, // REQUIRED for BullMQ
    enableReadyCheck: true,
    lazyConnect: true,
  });

  redis.on("ready", () => {
    logger.info({ message: "Redis connected successfully" });
  });

  redis.on("error", (err) => {
    logger.error({
      message: err.message,
      stack: err.stack,
      context: "redis",
    });
  });
}
if (redis) {
  redis.connect().catch(() => {});
}
console.log("Initializing Redis with:", redisUrl);

export default redis;
