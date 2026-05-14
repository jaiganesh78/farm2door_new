import prisma from "../../config/prisma.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import { enqueueOtpJob } from "../../jobs/notification.job.js";
import { finalizeInventory } from "../../utils/inventory.js";

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const stripOtpFields = (delivery) => {
  if (!delivery) return delivery;

  if (Array.isArray(delivery)) {
    return delivery.map(stripOtpFields);
  }

  const { otp, otpExpiry, ...safe } = delivery;
  return safe;
};

const deliveryInclude = {
  deliveryPartner: {
    select: {
      id: true,
      name: true,
      phone: true,
      rating: true,
    },
  },
  order: {
    include: {
      buyer: true,
      farmer: true,
      listing: true,
      payment: true,
    },
  },
};

const assertCanAccessDelivery = (user, delivery) => {
  if (user.role === "ADMIN") return;

  const order = delivery.order;

  if (user.role === "BUYER" && order?.buyerId === user.id) return;
  if (user.role === "FARMER" && order?.farmerId === user.id) return;
  if (user.role === "DELIVERY" && delivery.deliveryPartnerId === user.id) return;

  throw httpError(403, "Unauthorized");
};
// Assign delivery partner
export const assignDelivery = async (user, orderId, deliveryPartnerId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  const existingDelivery = await prisma.delivery.findUnique({
  where: { orderId },
});

if (existingDelivery) {
  throw new Error("Delivery already assigned");
}

  if (!order) throw new Error("Order not found");

  // 🔥 ADD THIS CHECK
  if (user.role !== "ADMIN" && user.id !== order.farmerId) {
    throw new Error("Unauthorized to assign delivery");
  }
  const allowBypass = process.env.ALLOW_UNPAID_DELIVERY === "true";

if (order.paymentStatus !== "SUCCESS" && !allowBypass) {
  throw new Error("Order not paid yet");
}
const partner = await prisma.user.findUnique({
  where: { id: deliveryPartnerId },
});

if (!partner || partner.role !== "DELIVERY") {
  throw new Error("Invalid delivery partner");
}

  const delivery = await prisma.delivery.create({
    data: {
      orderId,
      deliveryPartnerId,
      pickupLat: 0,
      pickupLng: 0,
      dropLat: 0,
      dropLng: 0,
      status: "ASSIGNED",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "ASSIGNED" },
  });

  return delivery;
};

// Get available missions for delivery partners
export const getAvailableMissions = async () => {
  return await prisma.order.findMany({
    where: {
      status: "CONFIRMED",
      paymentStatus: "SUCCESS",
      delivery: null,
    },
    include: {
      listing: true,
      buyer: {
        select: { id: true, name: true, phone: true },
      },
      farmer: {
        select: { id: true, name: true, phone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Accept a mission (Delivery Partner self-assignment)
export const acceptMission = async (user, orderId) => {
  if (user.role !== "DELIVERY") {
    throw httpError(403, "Only delivery partners can accept missions");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { listing: true, delivery: true },
  });

  if (!order) throw httpError(404, "Order not found");
  if (order.delivery) throw httpError(400, "Mission already assigned");
  if (order.status !== "CONFIRMED") throw httpError(400, "Order not ready for delivery");

  const delivery = await prisma.delivery.create({
    data: {
      orderId,
      deliveryPartnerId: user.id,
      pickupLat: order.listing.latitude,
      pickupLng: order.listing.longitude,
      dropLat: 0,
      dropLng: 0,
      status: "ASSIGNED",
    },
    include: deliveryInclude,
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "ASSIGNED" },
  });

  return stripOtpFields(delivery);
};

// Update delivery status
export const updateStatus = async (user, deliveryId, status, proofImageUrl, io) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: { order: true },
  });

  if (!delivery) throw new Error("Delivery not found");

  if (user.id !== delivery.deliveryPartnerId) {
    throw new Error("Unauthorized");
  }

  // Generate OTP when marking delivered
  let otp = null;
let otpHash = null;
let otpExpiry = null;

if (status === "DELIVERED" && delivery.status !== "DELIVERED") {
  otp = Math.floor(1000 + Math.random() * 9000).toString();

  otpHash = await bcrypt.hash(otp, 10);
  otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

  await enqueueOtpJob(delivery.id, delivery.order.buyerId, otp);
}
  const validTransitions = {
    ASSIGNED: ["PICKED_UP"],
    PICKED_UP: ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED"],
  };
  
  if (
    validTransitions[delivery.status] &&
    !validTransitions[delivery.status].includes(status)
  ) {
    throw new Error("Invalid status transition");
  }

  const updated = await prisma.delivery.update({
    where: { id: deliveryId },
    data: {
  status,
  otp: otpHash,
  proofImageUrl,
  deliveredAt: status === "DELIVERED" ? new Date() : null,
  otpExpiry,
},
  });

  logger.info({
    message: "Delivery status updated",
    deliveryId,
    status,
    userId: user.id,
  });

  await prisma.order.update({
    where: { id: delivery.orderId },
    data: { status },
  });

  // Emit real-time status update
  if (io) {
    io.to(deliveryId).emit("delivery:status:update", {
      deliveryId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  return updated;
};

// Verify OTP → release payment
export const verifyOtp = async (user, deliveryId, otp, io) => {
  const result = await prisma.$transaction(async (tx) => {
    const delivery = await tx.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        order: {
          select: {
            id: true,
            buyerId: true,
            listingId: true,
            quantity: true,
          },
        },
      },
    });

    if (!delivery) throw new Error("Delivery not found");

    const isValidOtp = await bcrypt.compare(otp, delivery.otp || "");

if (!isValidOtp) {
  throw new Error("Invalid OTP");
}

if (delivery.otpExpiry && new Date() > delivery.otpExpiry) {
  throw new Error("OTP expired");
}

    if (user.id !== delivery.order.buyerId && user.id !== delivery.deliveryPartnerId) {
      throw new Error("Only buyer or delivery partner can verify");
    }

    if (delivery.status !== "DELIVERED") {
      throw new Error("Delivery not completed yet");
    }

    const payment = await tx.payment.findUnique({
      where: { orderId: delivery.orderId },
    });
    
    const allowBypass = process.env.ALLOW_FAKE_PAYMENT === "true";
    
    if ((!payment || payment.status !== "SUCCESS") && !allowBypass) {
      throw new Error("Payment not completed");
    }

    if (payment && payment.escrowStatus !== "HELD") {
      throw new Error("Escrow already processed");
    }

    // 🔥 RELEASE ESCROW (ONLY PLACE IN SYSTEM)
    if (payment) {
      await tx.payment.update({
        where: { orderId: delivery.orderId },
        data: {
          escrowStatus: "RELEASED",
          status: "SUCCESS",
        },
      });
    }

    // clear OTP
    await tx.delivery.update({
      where: { id: deliveryId },
      data: { otp: null, otpExpiry: null, status: "COMPLETED" },
    });
    await finalizeInventory(
      tx,
      delivery.order.listingId,
      delivery.order.quantity,
      {
        orderId: delivery.order.id,
        deliveryId,
        reason: "delivery_completed",
      }
    );

    // complete order
    await tx.order.update({
      where: { id: delivery.orderId },
      data: { status: "COMPLETED" },
    });

    return { message: "Delivery confirmed & payment released" };
  });

  // Emit completion after transaction
  if (io) {
    io.to(deliveryId).emit("delivery:status:update", {
      deliveryId,
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    });
  }

  return result;
};

export const updateLocation = async (user, deliveryId, lat, lng, io) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    select: {
      id: true,
      deliveryPartnerId: true,
      lastUpdatedAt: true,
    },
  });

  if (!delivery) throw new Error("Delivery not found");
  if (user.id !== delivery.deliveryPartnerId) {
    throw new Error("Unauthorized to update location");
  }

  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Invalid location data");
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Invalid location data");
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error("Invalid location data");
  }

  const now = Date.now();
  if (delivery.lastUpdatedAt) {
    const last = new Date(delivery.lastUpdatedAt).getTime();
    if (now - last < 3000) {
      throw new Error("Too many location updates");
    }
  }

  const updatedAt = new Date(now);
  await prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      lastLat: lat,
      lastLng: lng,
      lastUpdatedAt: updatedAt,
    },
  });

  const payload = {
    deliveryId,
    lat,
    lng,
    timestamp: updatedAt.toISOString(),
  };

  io.to(deliveryId).emit("delivery:location:update", payload);

  return { message: "Location updated" };
};

export const getDeliveryById = async (user, deliveryId) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: deliveryInclude,
  });

  if (!delivery) {
    throw httpError(404, "Delivery not found");
  }

  assertCanAccessDelivery(user, delivery);
  return stripOtpFields(delivery);
};

export const getMyDeliveries = async (user) => {
  let where = undefined;

  if (user.role === "DELIVERY") {
    where = { deliveryPartnerId: user.id };
  } else if (user.role === "BUYER") {
    where = { order: { buyerId: user.id } };
  } else if (user.role === "FARMER") {
    where = { order: { farmerId: user.id } };
  } else if (user.role === "ADMIN") {
    where = {};
  } else {
    throw httpError(403, "Unauthorized");
  }

  const deliveries = await prisma.delivery.findMany({
    where,
    include: deliveryInclude,
    orderBy: { assignedAt: "desc" },
  });

  return stripOtpFields(deliveries);
};

export const getDeliveryLocation = async (user, deliveryId) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    select: {
      id: true,
      deliveryPartnerId: true,
      lastLat: true,
      lastLng: true,
      lastUpdatedAt: true,
      order: {
        select: {
          buyerId: true,
          farmerId: true,
        },
      },
    },
  });

  if (!delivery) {
    throw httpError(404, "Delivery not found");
  }

  assertCanAccessDelivery(user, delivery);

  if (delivery.lastLat == null || delivery.lastLng == null)  {
    throw httpError(400, "Location not available yet");
  }
  
  return {
    deliveryId: delivery.id,
    lat: delivery.lastLat,
    lng: delivery.lastLng,
    lastUpdatedAt: delivery.lastUpdatedAt,
  };
};

export const uploadDeliveryProofImage = async (user, deliveryId, imageUrl) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    select: {
      id: true,
      deliveryPartnerId: true,
      proofImageUrl: true,
    },
  });

  if (!delivery) {
    throw httpError(404, "Delivery not found");
  }

  if (user.id !== delivery.deliveryPartnerId) {
    throw httpError(403, "Unauthorized");
  }

  const { safeDeleteCloudinaryImageByUrl } = await import(
    "../../utils/cloudinary.utils.js"
  );

  if (delivery.proofImageUrl) {
    await safeDeleteCloudinaryImageByUrl(delivery.proofImageUrl);
  }

  const updated = await prisma.delivery.update({
    where: { id: deliveryId },
    data: { proofImageUrl: imageUrl },
  });

  return { imageUrl: updated.proofImageUrl };
};