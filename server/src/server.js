import http from "http";
import "./queues/worker.js";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { errorHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import logger from "./utils/logger.js";
import negotiationRoutes from "./modules/negotiations/negotiation.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";
import { authorize } from "./middleware/role.middleware.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import deliveryRoutes from "./modules/delivery/delivery.routes.js";
import jwt from "jsonwebtoken";
import prisma from "./config/prisma.js";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import disputeRoutes from "./modules/disputes/dispute.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
// import passport from "./config/passport.js";
import listingRoutes from "./modules/listings/listing.routes.js";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import { xssClean } from "./middleware/xss.middleware.js";
import { requestId } from "./middleware/requestId.middleware.js";
import { env } from "./config/env.js";
import redis from "./config/redis.js";
const app = express();

const server = http.createServer(app);
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0) {
      return cb(new Error("CORS not configured"));
    }
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS origin not allowed"));
  },
  credentials: true,
};
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(helmet());
app.use(hpp());

const allowedOrigins = (env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);



const io = new Server(server, {
  cors: {
    origin: (origin, cb) => corsOptions.origin(origin, cb),
    credentials: true,
  },
});
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests per IP
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

app.use((req, res, next) => {
  const path = req.originalUrl.split("?")[0];

  if (path === "/api/payments/webhook") {
    return next(); // skip rate limit
  }

  return globalLimiter(req, res, next);
});
app.set("io", io);
io.use((socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Unauthorized"));
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice("Bearer ".length).trim();
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
    if (!decoded || typeof decoded !== "object" || !decoded.id || !decoded.role) {
      return next(new Error("Unauthorized"));
    }

    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});
io.on("connection", (socket) => {
  logger.info({
    message: "Socket client connected",
    socketId: socket.id,
  });

  socket.on("joinDeliveryRoom", async (deliveryId) => {
  try {
    if (!socket.user?.id) {
      throw new Error("Unauthorized");
    }

    const roomId = String(deliveryId);
    if (socket.rooms.has(roomId)) {
      return;
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: roomId },
      include: { order: true },
    });

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    const userId = socket.user.id;

    // Only buyer, farmer, or delivery partner can join
    if (
      userId !== delivery.order.buyerId &&
      userId !== delivery.order.farmerId &&
      userId !== delivery.deliveryPartnerId
    ) {
      throw new Error("Unauthorized room access");
    }

    socket.join(roomId);

    logger.info({
      message: "User joined delivery room",
      deliveryId: roomId,
      userId,
    });
  } catch (err) {
    socket.emit("error", err.message);
  }
});

  socket.on("disconnect", () => {
    logger.info({
      message: "Socket client disconnected",
      socketId: socket.id,
    });
  });
});

app.use((req, res, next) => {
  const path = req.originalUrl.split("?")[0];
  if (path === "/api/payments/webhook") {
    return next();
  }
  express.json({ limit: "100kb" })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.use((req, res, next) => {
  const path = req.originalUrl.split("?")[0];

  if (path === "/api/payments/webhook") {
    return next();
  }

  try {
    return mongoSanitize({
      replaceWith: "_",
    })(req, res, next);
  } catch (err) {
    return next();
  }
});
app.use((req, res, next) => {
  const path = req.originalUrl.split("?")[0];
  if (path === "/api/payments/webhook") return next();
  return xssClean(req, res, next);
});


app.use(requestId);

app.use(requestLogger);
app.use("/api/admin", adminRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/negotiations", negotiationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // only 5 attempts
  message: {
    success: false,
    message: "Too many OTP attempts",
  },
});

app.use("/api/delivery", deliveryRoutes);
app.get(
  "/api/test/farmer",
  authenticate,
  authorize("FARMER"),
  (req, res) => {
    res.json({
      message: "Farmer access granted",
      user: req.user,
    });
  }
);
app.use("/api/auth", authRoutes);
// app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    if (redis) {
      await redis.ping();
    }
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: "Service unavailable",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Farm2Door API running");
});

app.use(errorHandler);


const PORT = env.PORT;

const httpServer = server.listen(PORT, () => {
  logger.info({
    message: "Server running",
    port: PORT,
  });
});

let shuttingDown = false;
const shutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info({ message: "Shutdown started", signal });

  try {
    io.close();
  } catch {}

  await new Promise((resolve) => {
    httpServer.close(() => resolve());
  });

  try {
    await prisma.$disconnect();
  } catch (err) {
    logger.error({ message: err.message, stack: err.stack, context: "shutdown" });
  }

  try {
    if (redis) await redis.quit();
  } catch (err) {
    logger.error({ message: err.message, stack: err.stack, context: "shutdown" });
  }

  try {
    const workers = globalThis.__bullmqWorkers;
    if (Array.isArray(workers)) {
      await Promise.allSettled(workers.map((w) => w?.close?.()));
    }
  } catch (err) {
    logger.error({ message: err.message, stack: err.stack, context: "shutdown" });
  }

  try {
    const queueEvents = globalThis.__bullmqQueueEvents;
    if (Array.isArray(queueEvents)) {
      await Promise.allSettled(queueEvents.map((q) => q?.close?.()));
    }
  } catch (err) {
    logger.error({ message: err.message, stack: err.stack, context: "shutdown" });
  }

  try {
    const schedulers = globalThis.__bullmqSchedulers;
    if (Array.isArray(schedulers)) {
      await Promise.allSettled(schedulers.map((s) => s?.close?.()));
    }
  } catch (err) {
    logger.error({ message: err.message, stack: err.stack, context: "shutdown" });
  }
  try {
    const queues = globalThis.__bullmqQueues;
    if (Array.isArray(queues)) {
      await Promise.allSettled(queues.map((q) => q?.close?.()));
    }
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      context: "shutdown",
    });
  }
  logger.info({ message: "Shutdown complete" });
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));