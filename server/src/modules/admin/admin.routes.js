import express from "express";
import * as adminController from "./admin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  adminController.getUsers
);

router.get(
  "/orders",
  authenticate,
  authorize("ADMIN"),
  adminController.getOrders
);

router.get(
  "/deliveries",
  authenticate,
  authorize("ADMIN"),
  adminController.getDeliveries
);

export default router;
