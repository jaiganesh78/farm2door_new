import logger from "../utils/logger.js";
import { createQueue } from "../config/bullmq.js";
import { JOBS, JOB_DEFAULTS, QUEUES } from "./job.constants.js";

let notificationQueue = null;

const getNotificationQueue = () => {
  if (notificationQueue) return notificationQueue;
  notificationQueue = createQueue(QUEUES.NOTIFICATIONS, {
    defaultJobOptions: JOB_DEFAULTS,
  });
  return notificationQueue;
};

export async function enqueueOtpJob(deliveryId, userId, otp) {
  try {
    const queue = getNotificationQueue();
    const jobId = `otp:${deliveryId}`;

    const existing = await queue.getJob(jobId);
    if (existing) {
      const state = await existing.getState();
      const preventStates = new Set([
        "waiting",
        "delayed",
        "active",
        "paused",
        "prioritized",
        "waiting-children",
      ]);

      if (preventStates.has(state)) {
        logger.info({
          message: "Duplicate OTP job prevented",
          queueName: QUEUES.NOTIFICATIONS,
          jobName: JOBS.SEND_OTP,
          jobId,
          deliveryId,
          userId,
          state,
          timestamp: new Date().toISOString(),
        });
        return {
          jobId,
          state,
          deliveryId,
        };
      }
    }

    const job = await queue.add(
      JOBS.SEND_OTP,
      { deliveryId, userId, otp },
      {
        ...JOB_DEFAULTS,
        jobId,
      }
    );

    logger.info({
      message: "OTP job queued",
      queueName: QUEUES.NOTIFICATIONS,
      jobName: JOBS.SEND_OTP,
      jobId: job.id,
      deliveryId,
      userId,
      timestamp: new Date().toISOString(),
    });

    return {
      jobId: job.id,
      state: "queued",
      deliveryId,
    };
  } catch (err) {
    logger.error({
      message: err?.message || "Failed to enqueue OTP job",
      stack: err?.stack,
      queueName: QUEUES.NOTIFICATIONS,
      jobName: JOBS.SEND_OTP,
      deliveryId,
      userId,
      timestamp: new Date().toISOString(),
    });
    return;
  }
}

