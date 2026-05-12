import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const allowedMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ensureCloudinary = () => {
  if (!cloudinary) {
    const err = new Error("Upload service not configured");
    err.statusCode = 503;
    throw err;
  }
};

const fileFilter = (_req, file, cb) => {
  try {
    ensureCloudinary();

    if (!file) {
      const err = new Error("No file provided");
      err.statusCode = 400;
      return cb(err);
    }

    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!allowedExt.has(ext)) {
      const err = new Error("Only image uploads are allowed");
      err.statusCode = 400;
      return cb(err);
    }

    if (!allowedMime.has(file.mimetype)) {
      const err = new Error("Only image uploads are allowed");
      err.statusCode = 400;
      return cb(err);
    }

    return cb(null, true);
  } catch (err) {
    return cb(err);
  }
};

const storageForFolder = (folder) => {
  if (!cloudinary) {
    return multer.memoryStorage();
  }

  return new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
  });
};

export const uploadListingImage = multer({
  storage: storageForFolder("farm2door/listings"),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter,
});

export const uploadDeliveryProofImage = multer({
  storage: storageForFolder("farm2door/delivery-proofs"),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter,
});

