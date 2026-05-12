import prisma from "../../config/prisma.js";
import { finalizeInventory, restoreInventory } from "../../utils/inventory.js";

const assertReason = (reason) => {
  if (typeof reason !== "string" || !reason.trim()) {
    throw new Error("reason is required");
  }
  return reason.trim();
};

export const raiseDispute = async (orderId, user, reason) => {
  const cleanReason = assertReason(reason);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "COMPLETED") {
    throw new Error("Cannot raise dispute for a completed order");
  }

  if (user.id !== order.buyerId && user.id !== order.farmerId) {
    throw new Error("Only the buyer or farmer can raise a dispute");
  }

  const existing = await prisma.dispute.findFirst({
    where: { orderId },
  });

  if (existing) {
    throw new Error("A dispute already exists for this order");
  }

  const dispute = await prisma.dispute.create({
    data: {
      orderId,
      raisedBy: user.id,
      reason: cleanReason,
      status: "OPEN",
    },
  });

  return dispute;
};

export const getDisputeByOrderId = async (orderId, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const isParty =
    user.id === order.buyerId || user.id === order.farmerId;
  const isAdmin = user.role === "ADMIN";

  if (!isParty && !isAdmin) {
    throw new Error("Unauthorized to view this dispute");
  }

  const dispute = await prisma.dispute.findFirst({
    where: { orderId },
  });

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  return dispute;
};

export const resolveDispute = async (disputeId, resolution, action) => {
  if (typeof resolution !== "string" || !resolution.trim()) {
    throw new Error("resolution is required");
  }

  if (action !== "REFUND" && action !== "RELEASE") {
    throw new Error('action must be "REFUND" or "RELEASE"');
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
  });

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  if (dispute.status !== "OPEN") {
    throw new Error("Dispute is not open");
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId: dispute.orderId },
  });

  if (!payment) {
    throw new Error("Payment not found for this order");
  }
  if (payment.escrowStatus !== "HELD") {
    throw new Error("Escrow already processed");
  }

  const trimmedResolution = resolution.trim();

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: dispute.orderId },
      select: { id: true, listingId: true, quantity: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (action === "REFUND") {
      await restoreInventory(tx, order.listingId, order.quantity, {
        orderId: order.id,
        disputeId,
        reason: "dispute_refund",
      });

      await tx.payment.update({
        where: { orderId: dispute.orderId },
        data: {
          escrowStatus: "REFUNDED",
          status: "REFUNDED",
        },
      });

      await tx.order.update({
        where: { id: dispute.orderId },
        data: { status: "CANCELLED" },
      });
    } else {
      await tx.payment.update({
        where: { orderId: dispute.orderId },
        data: {
          escrowStatus: "RELEASED",
          status: "SUCCESS",
        },
      });

      await finalizeInventory(tx, order.listingId, order.quantity, {
        orderId: order.id,
        disputeId,
        reason: "dispute_release",
      });

      await tx.order.update({
        where: { id: dispute.orderId },
        data: { status: "COMPLETED" },
      });
    }

    await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: "RESOLVED",
        resolution: trimmedResolution,
      },
    });
    return await tx.dispute.findUnique({
      where: { id: disputeId },
    });
  });

  return result;
};
