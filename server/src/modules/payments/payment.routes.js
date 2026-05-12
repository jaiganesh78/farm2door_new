import express from "express";
import * as controller from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/webhook", controller.webhook);
router.post("/:orderId/create-order", authenticate, controller.createOrder);
router.post("/verify", authenticate, controller.verify);


export default router;