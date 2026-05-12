import logger from "../utils/logger.js";
import { env } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    ...(req.requestId != null && { requestId: req.requestId }),
    ...(req.user?.id != null && { userId: req.user.id }),
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // JWT / auth errors
  if (err?.name === "TokenExpiredError" || err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized";
  }

  // Prisma known errors
  if (err?.code && typeof err.code === "string" && err.code.startsWith("P")) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Conflict";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Not found";
    } else {
      statusCode = 400;
      message = "Bad request";
    }
  }

  // express-rate-limit errors
  if (statusCode === 429) {
    message = "Too many requests";
  }

  const isProd = env.NODE_ENV === "production";
  const isOperational = err?.isOperational === true || statusCode < 500;

  if (isProd) {
    res.status(statusCode).json({
      success: false,
      message: isOperational ? message : "Internal Server Error",
      ...(req.requestId != null && { requestId: req.requestId }),
    });
    return;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: err?.stack,
    ...(req.requestId != null && { requestId: req.requestId }),
  });
};