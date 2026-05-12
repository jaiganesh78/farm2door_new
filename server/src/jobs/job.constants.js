export const QUEUES = Object.freeze({
  NOTIFICATIONS: "notifications",
  DEAD_LETTER: "notifications-dead-letter",
});

export const JOBS = Object.freeze({
  SEND_OTP: "SEND_OTP",
  DEAD_LETTER: "DEAD_LETTER",
});

export const JOB_DEFAULTS = Object.freeze({
  attempts: Number(process.env.BULLMQ_ATTEMPTS ?? 3),
  backoff: {
    type: "exponential",
    delay: Number(process.env.BULLMQ_BACKOFF_DELAY_MS ?? 2000),
  },
  removeOnComplete: true,
  removeOnFail: Number(process.env.BULLMQ_REMOVE_ON_FAIL_COUNT ?? 500),
});

