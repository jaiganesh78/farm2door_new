import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = req.requestId;

  const logRequest = () => {
    const durationMs = Date.now() - start;
    const userId = req.user?.id;
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"]?.toString()?.split(",")?.[0]?.trim();
    const userAgent = req.get("user-agent");
  
    logger.info({
      message: "HTTP request",
      requestId,
      method: req.method,
      url: req.path,
      status: res.statusCode,
      durationMs,
      ip,
      userAgent,
      ...(userId != null && { userId }),
    });
  };
  
  res.on("finish", logRequest);

  next();
};
