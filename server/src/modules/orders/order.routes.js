import express from "express";
import * as controller from "./order.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my", authenticate, controller.getMyOrders);
router.get("/:id", authenticate, controller.getOrderById);

export default router;
