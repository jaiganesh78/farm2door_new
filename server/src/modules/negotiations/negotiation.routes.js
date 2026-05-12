import express from "express";
import * as controller from "./negotiation.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createOfferSchema } from "./negotiation.validation.js";

const router = express.Router();

router.post(
  "/offer",
  authenticate,
  validate(createOfferSchema),
  controller.createOffer
);
router.get(
  "/list/all",
  authenticate,
  controller.getMyNegotiations
);
router.get("/:id", authenticate, controller.getNegotiation);
router.post("/:id/respond", authenticate, controller.respond);

export default router;