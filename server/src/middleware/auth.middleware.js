import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // quick structural guard before verify
    const parts = token.split(".");
    if (parts.length !== 3) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};