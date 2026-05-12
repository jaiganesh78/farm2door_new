import { env } from "../config/env.js";
import logger from "../utils/logger.js";
import {
  createQueue,
  createQueueEvents,
  createWorker,
} from "../config/bullmq.js";
import { JOBS, JOB_DEFAULTS, QUEUES } from "../jobs/job.constants.js";

const nowIso = () => new Date().toISOString();

let notificationQueue;
let deadLetterQueue;

try {


  notificationQueue = createQueue(QUEUES.NOTIFICATIONS, {
    defaultJobOptions: JOB_DEFAULTS,
  });
  deadLetterQueue = createQueue(QUEUES.DEAD_LETTER, {
    defaultJobOptions: JOB_DEFAULTS,
  });
} catch (err) {
  logger.error({
    message: err?.message || "BullMQ worker cannot start",
    stack: err?.stack,
    context: "bullmq-worker",
    timestamp: nowIso(),
  });
  process.exit(1);
}

const notificationEvents = createQueueEvents(QUEUES.NOTIFICATIONS);
notificationEvents.on("waiting", ({ jobId }) => {
  logger.info({
    message: "Job waiting",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    timestamp: nowIso(),
  });
});
notificationEvents.on("active", ({ jobId, prev }) => {
  logger.info({
    message: "Job active",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    prev,
    timestamp: nowIso(),
  });
});
notificationEvents.on("delayed", ({ jobId, delay }) => {
  logger.warn({
    message: "Job delayed",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    delay,
    timestamp: nowIso(),
  });
});
notificationEvents.on("stalled", ({ jobId }) => {
  logger.error({
    message: "Job stalled",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    timestamp: nowIso(),
  });
});
notificationEvents.on("completed", ({ jobId, returnvalue }) => {
  logger.info({
    message: "Job completed (events)",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    returnvalue,
    timestamp: nowIso(),
  });
});
notificationEvents.on("failed", ({ jobId, failedReason }) => {
  logger.error({
    message: "Job failed (events)",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    failedReason,
    timestamp: nowIso(),
  });
});
notificationEvents.on("error", (err) => {
  logger.error({
    message: err?.message || "QueueEvents error",
    stack: err?.stack,
    queueName: QUEUES.NOTIFICATIONS,
    timestamp: nowIso(),
  });
});

const worker = createWorker(
  QUEUES.NOTIFICATIONS,
  async (job) => {
    const deliveryId = job?.data?.deliveryId;
    const userId = job?.data?.userId;

    logger.info({
      message: "Job processing started",
      queueName: QUEUES.NOTIFICATIONS,
      jobName: job.name,
      jobId: job.id,
      attemptsMade: job.attemptsMade,
      attempt: job.attemptsMade + 1,
      deliveryId,
      userId,
      timestamp: nowIso(),
    });

    if (job.name !== JOBS.SEND_OTP) {
      logger.warn({
        message: "Unknown job name",
        queueName: QUEUES.NOTIFICATIONS,
        jobName: job.name,
        jobId: job.id,
        timestamp: nowIso(),
      });
      return;
    }

    // OTP sending is intentionally idempotent via deterministic jobId.
    // Do NOT log OTP value.
    return { ok: true };
  },
  {
    concurrency: Number(process.env.BULLMQ_CONCURRENCY ?? 5),
  }
);

worker.on("completed", (job) => {
  logger.info({
    message: "Job completed (worker)",
    queueName: QUEUES.NOTIFICATIONS,
    jobName: job.name,
    jobId: job.id,
    attemptsMade: job.attemptsMade,
    deliveryId: job?.data?.deliveryId,
    userId: job?.data?.userId,
    timestamp: nowIso(),
  });
});

worker.on("failed", async (job, err) => {
  logger.error({
    message: "Job failed (worker)",
    queueName: QUEUES.NOTIFICATIONS,
    jobName: job?.name,
    jobId: job?.id,
    attemptsMade: job?.attemptsMade,
    attempts: job?.opts?.attempts,
    deliveryId: job?.data?.deliveryId,
    userId: job?.data?.userId,
    error: err?.message,
    stack: err?.stack,
    timestamp: nowIso(),
  });

  try {
    const attempts = job?.opts?.attempts ?? JOB_DEFAULTS.attempts;
    const exhausted = (job?.attemptsMade ?? 0) >= attempts;
    if (!exhausted) {
      logger.warn({
        message: "Retry scheduled",
        queueName: QUEUES.NOTIFICATIONS,
        jobName: job?.name,
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        attempts,
        deliveryId: job?.data?.deliveryId,
        userId: job?.data?.userId,
        timestamp: nowIso(),
      });
      return;
    }

    const dlqJobId = `dlq:${job?.id}`;
    const existingDlq = await deadLetterQueue.getJob(dlqJobId);
    if (!existingDlq) {
      await deadLetterQueue.add(
        JOBS.DEAD_LETTER,
        {
          originalQueue: QUEUES.NOTIFICATIONS,
          originalJobName: job?.name,
          originalJobId: job?.id,
          deliveryId: job?.data?.deliveryId,
          userId: job?.data?.userId,
          payload: job?.data,
          attemptsMade: job?.attemptsMade,
          failedReason: err?.message,
          stack: err?.stack,
          timestamp: nowIso(),
        },
        {
          ...JOB_DEFAULTS,
          jobId: dlqJobId,
        }
      );
    }

    logger.error({
      message: "Job moved to dead-letter queue",
      queueName: QUEUES.DEAD_LETTER,
      jobName: JOBS.DEAD_LETTER,
      jobId: dlqJobId,
      originalJobId: job?.id,
      deliveryId: job?.data?.deliveryId,
      userId: job?.data?.userId,
      timestamp: nowIso(),
    });
  } catch (dlqErr) {
    logger.error({
      message: dlqErr?.message || "Failed to enqueue dead-letter job",
      stack: dlqErr?.stack,
      context: "bullmq-dlq",
      originalJobId: job?.id,
      timestamp: nowIso(),
    });
  }
});

worker.on("stalled", (jobId) => {
  logger.error({
    message: "Job stalled (worker)",
    queueName: QUEUES.NOTIFICATIONS,
    jobId,
    timestamp: nowIso(),
  });
});

worker.on("error", (err) => {
  logger.error({
    message: err?.message || "Worker error",
    stack: err?.stack,
    queueName: QUEUES.NOTIFICATIONS,
    timestamp: nowIso(),
  });
});

const dlqWorker = createWorker(
  QUEUES.DEAD_LETTER,
  async (job) => {
    logger.error({
      message: "Dead-letter job received",
      queueName: QUEUES.DEAD_LETTER,
      jobName: job.name,
      jobId: job.id,
      originalJobId: job?.data?.originalJobId,
      originalJobName: job?.data?.originalJobName,
      originalQueue: job?.data?.originalQueue,
      attemptsMade: job?.data?.attemptsMade,
      failedReason: job?.data?.failedReason,
      deliveryId: job?.data?.deliveryId,
      userId: job?.data?.userId,
      timestamp: nowIso(),
    });
    return { ok: true };
  },
  { concurrency: 1 }
);

dlqWorker.on("error", (err) => {
  logger.error({
    message: err?.message || "DLQ worker error",
    stack: err?.stack,
    queueName: QUEUES.DEAD_LETTER,
    timestamp: nowIso(),
  });
});

logger.info({
  message: "BullMQ workers started",
  env: env.NODE_ENV,
  queues: [QUEUES.NOTIFICATIONS, QUEUES.DEAD_LETTER],
  timestamp: nowIso(),
});

export default worker;

