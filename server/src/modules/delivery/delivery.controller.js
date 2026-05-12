import * as service from "./delivery.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const assign = asyncHandler(async (req, res) => {
  const { deliveryPartnerId } = req.body;

  const result = await service.assignDelivery(
    req.user,
    req.params.orderId,
    deliveryPartnerId
  );

  res.json({
    success: true,
    data: result,
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const result = await service.updateStatus(
    req.user,
    req.params.id,
    req.body.status,
    req.body.proofImageUrl
  );

  res.json({
    success: true,
    data: result,
  });
});

export const verify = asyncHandler(async (req, res) => {
  const result = await service.verifyOtp(
    req.user,
    req.params.id,
    req.body.otp
  );

  res.json({
    success: true,
    data: result,
  });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const io = req.app.get("io");

  const result = await service.updateLocation(
    req.user,
    req.params.id,
    req.body.lat,
    req.body.lng,
    io
  );

  res.json({
    success: true,
    data: result,
  });
});

export const getDelivery = async (req, res, next) => {
  try {
    const data = await service.getDeliveryById(req.user, req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getMyDeliveries = async (req, res, next) => {
  try {
    const data = await service.getMyDeliveries(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getLocation = async (req, res, next) => {
  try {
    const data = await service.getDeliveryLocation(req.user, req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const uploadProofImage = asyncHandler(async (req, res) => {
  const imageUrl = req.file?.path;
  if (!imageUrl) {
    const err = new Error("No file provided");
    err.statusCode = 400;
    throw err;
  }

  const data = await service.uploadDeliveryProofImage(
    req.user,
    req.params.id,
    imageUrl
  );

  res.json({ success: true, data });
});