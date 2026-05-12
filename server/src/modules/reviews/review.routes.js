import express from "express";
import * as reviewController from "./review.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createReviewSchema } from "./review.validation.js";

const router = express.Router();

router.get("/user/:userId", reviewController.getReviewsForUser);

router.post(
  "/:orderId",
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview
);

export default router;
