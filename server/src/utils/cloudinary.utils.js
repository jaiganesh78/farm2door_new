import cloudinary from "../config/cloudinary.js";
import logger from "./logger.js";

export const extractPublicIdFromCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  try {
    const u = new URL(url);
    const path = u.pathname || "";
    const idx = path.indexOf("/upload/");
    if (idx === -1) return null;

    let after = path.slice(idx + "/upload/".length);

    // remove transformations and version segments (best-effort)
    const parts = after.split("/").filter(Boolean);
    const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p));
    const publicParts =
      versionIndex >= 0 ? parts.slice(versionIndex + 1) : parts;

    if (publicParts.length === 0) return null;

    const joined = decodeURIComponent(publicParts.join("/"));
    return joined.replace(/\.[a-zA-Z0-9]+$/, "");
  } catch {
    return null;
  }
};

export const safeDeleteCloudinaryImageByUrl = async (url) => {
  if (!cloudinary) return;

  const publicId = extractPublicIdFromCloudinaryUrl(url);
  if (!publicId) {
    logger.warn({
      message: "Could not extract Cloudinary public id",
      url,
      context: "cloudinary",
    });
  
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (err) {
    logger.error({
      message: err?.message || "Cloudinary delete failed",
      stack: err?.stack,
      context: "cloudinary",
      publicId,
    });
  }
};

