import express from "express";
import * as controller from "./delivery.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import rateLimit from "express-rate-limit";
import { authorize } from "../../middleware/role.middleware.js";
import { uploadDeliveryProofImage } from "../../middleware/upload.middleware.js";
import {
  updateLocationSchema,
  updateStatusSchema,
  verifyOtpSchema,
  deliveryIdParamSchema,
} from "./delivery.validation.js";

const router = express.Router();
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many OTP attempts",
  },
});
router.post("/assign/:orderId", authenticate, controller.assign);
router.get("/available", authenticate, authorize("DELIVERY"), controller.getAvailable);
router.post("/:orderId/accept", authenticate, authorize("DELIVERY"), controller.accept);
router.get("/my", authenticate, controller.getMyDeliveries);
router.get("/:id/location", authenticate, controller.getLocation);
router.get("/:id", authenticate, controller.getDelivery);
router.patch(
  "/:id/status",
  authenticate,
  validate(updateStatusSchema),
  controller.updateStatus
);
router.post(
  "/:id/verify",
  otpLimiter,
  authenticate,
  validate(verifyOtpSchema),
  controller.verify
);
router.post(
  "/:id/location",
  authenticate,
  validate(updateLocationSchema),
  controller.updateLocation
);

router.post(
  "/:id/proof-image",
  authenticate,
  authorize("DELIVERY"),
  validate(deliveryIdParamSchema),
  uploadDeliveryProofImage.single("image"),
  controller.uploadProofImage
);
router.post(
  "/:id/pickup/request",
  authenticate,
  authorize("DELIVERY"),
  controller.requestPickupOtp
);

router.post(
  "/:id/pickup/verify",
  authenticate,
  authorize("DELIVERY"),
  controller.verifyPickupOtp
);
export default router;