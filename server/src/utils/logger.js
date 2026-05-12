import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.resolve(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const fileJsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...rest } = info;
    const meta = Object.fromEntries(
      Object.entries(rest).filter(
        ([k]) =>
          typeof k === "string" &&
          !k.startsWith("Symbol(") &&
          k !== "splat" &&
          k !== "level"
      )
    );
    const tail =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level} ${message ?? ""}${tail}`;
  })
);

const isProd = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: fileJsonFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: fileJsonFormat,
    }),
  ],
});

export default logger;
