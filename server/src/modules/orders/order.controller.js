import * as service from "./order.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getMyOrders = asyncHandler(async (req, res) => {
  const result = await service.getMyOrders(req.user);
  res.json(result);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const result = await service.getOrderById(req.user, req.params.id);
  res.json(result);
});
