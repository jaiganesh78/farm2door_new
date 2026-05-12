import express from "express";
import * as disputeController from "./dispute.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.patch(
  "/:id/resolve",
  authenticate,
  authorize("ADMIN"),
  disputeController.resolveDispute
);

router.post(
  "/:orderId",
  authenticate,
  disputeController.raiseDispute
);

router.get(
  "/:orderId",
  authenticate,
  disputeController.getDisputeByOrder
);

export default router;
