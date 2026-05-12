import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger.js";
import { env } from "./env.js";

const enabled =
  !!env.CLOUDINARY_CLOUD_NAME &&
  !!env.CLOUDINARY_API_KEY &&
  !!env.CLOUDINARY_API_SECRET;

if (!enabled) {
  logger.warn({
    message: "Cloudinary is not configured; uploads are disabled",
    context: "cloudinary",
  });
}

if (enabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export default enabled ? cloudinary : null;

