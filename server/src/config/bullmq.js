import bullmq from "bullmq";
import redis from "./redis.js";
import logger from "../utils/logger.js";

const { Queue, Worker, QueueEvents } = bullmq;


const registerGlobal = (key, instance) => {
  if (!globalThis[key]) {
    globalThis[key] = [];
  }
  globalThis[key].push(instance);
};

let redisListenersAttached = false;
const attachRedisListenersOnce = () => {
  if (redisListenersAttached || !redis) return;
  redisListenersAttached = true;

  redis.on("ready", () => {
    logger.info({ message: "Redis ready (BullMQ)", context: "bullmq" });
  });
  redis.on("reconnecting", (time) => {
    logger.warn({
      message: "Redis reconnecting (BullMQ)",
      context: "bullmq",
      time,
    });
  });
  redis.on("close", () => {
    logger.warn({ message: "Redis connection closed (BullMQ)", context: "bullmq" });
  });
  redis.on("error", (err) => {
    logger.error({
      message: err?.message || "Redis error (BullMQ)",
      stack: err?.stack,
      context: "bullmq",
    });
  });
};

const assertRedis = () => {
  if (!redis) {
    const err = new Error("Redis is not configured (missing REDIS_URL)");
    err.statusCode = 503;
    throw err;
  }
  attachRedisListenersOnce();
};

export const createQueue = (name, opts = {}) => {
  assertRedis();
  const queue = new Queue(name, {
    connection: redis,
    ...opts,
  });
  
  registerGlobal("__bullmqQueues", queue);
  
  return queue;
};

export const createWorker = (queueName, processor, opts = {}) => {
  assertRedis();
  const worker = new Worker(queueName, processor, {
    connection: redis,
    ...opts,
  });
  registerGlobal("__bullmqWorkers", worker);
  return worker;
};

export const createQueueEvents = (queueName, opts = {}) => {
  assertRedis();
  const qe = new QueueEvents(queueName, { connection: redis, ...opts });
  registerGlobal("__bullmqQueueEvents", qe);
  return qe;
};

export const createQueueScheduler = (queueName, opts = {}) => {
  assertRedis();
  if (typeof QueueScheduler !== "function") {
    const err = new Error("QueueScheduler is not available in this BullMQ version");
    err.statusCode = 500;
    throw err;
  }
  const scheduler = new QueueScheduler(queueName, {
    connection: redis,
    ...opts,
  });
  registerGlobal("__bullmqSchedulers", scheduler);
  return scheduler;
};

