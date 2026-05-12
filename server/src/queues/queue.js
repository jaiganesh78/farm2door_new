import { createQueue } from "../config/bullmq.js";
import { JOB_DEFAULTS, QUEUES } from "../jobs/job.constants.js";

let notificationQueue = null;
let deadLetterQueue = null;

try {
  notificationQueue = createQueue(QUEUES.NOTIFICATIONS, {
    defaultJobOptions: JOB_DEFAULTS,
  });
  deadLetterQueue = createQueue(QUEUES.DEAD_LETTER, {
    defaultJobOptions: JOB_DEFAULTS,
  });
} catch {
  notificationQueue = null;
  deadLetterQueue = null;
}

export { notificationQueue, deadLetterQueue };

