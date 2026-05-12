import dotenv from "dotenv";
import { z } from "zod";
import logger from "../utils/logger.js";

dotenv.config();

const nodeEnvSchema = z.enum(["development", "production", "test"]);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: nodeEnvSchema,

  REDIS_URL: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  CORS_ORIGIN: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
});

const parsed = envSchema
  .superRefine((val, ctx) => {
    const anyCloudinary =
      val.CLOUDINARY_CLOUD_NAME ||
      val.CLOUDINARY_API_KEY ||
      val.CLOUDINARY_API_SECRET;

    if (anyCloudinary) {
      if (!val.CLOUDINARY_CLOUD_NAME) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["CLOUDINARY_CLOUD_NAME"],
          message: "CLOUDINARY_CLOUD_NAME is required when Cloudinary is enabled",
        });
      }
      if (!val.CLOUDINARY_API_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["CLOUDINARY_API_KEY"],
          message: "CLOUDINARY_API_KEY is required when Cloudinary is enabled",
        });
      }
      if (!val.CLOUDINARY_API_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["CLOUDINARY_API_SECRET"],
          message:
            "CLOUDINARY_API_SECRET is required when Cloudinary is enabled",
        });
      }
    }
  })
  .safeParse(process.env);

if (!parsed.success) {
  logger.error({
    message: "Invalid environment configuration",
    errors: parsed.error.flatten(),
    context: "env",
  });
  process.exit(1);
}

export const env = parsed.data;

