import prisma from "../../config/prisma.js";
import razorpay from "../../config/razorpay.js";
import crypto from "crypto";
import logger from "../../utils/logger.js";
import { restoreInventory } from "../../utils/inventory.js";

const finalizeCapturedRazorpayPayment = async (
  tx,
  orderId,
  razorpay_payment_id,
  razorpay_order_id
) => {
  const order = await tx.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  const existingPayment = await tx.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment && existingPayment.status === "SUCCESS") {
    return { payment: existingPayment, alreadySuccess: true };
  }

  const payment = await tx.payment.upsert({
    where: { orderId },
    update: {
      status: "SUCCESS",
      escrowStatus: "HELD",
      transactionId: razorpay_payment_id,
      method: "RAZORPAY",
    },
    create: {
      orderId,
      amount: order.totalAmount,
      razorpayOrderId: razorpay_order_id,
      method: "RAZORPAY",
      status: "SUCCESS",
      escrowStatus: "HELD",
      transactionId: razorpay_payment_id,
    },
  });

  await tx.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "SUCCESS",
      status: "CONFIRMED",
    },
  });

  return { payment, alreadySuccess: false };
};

const verifyRazorpayWebhookSignature = (rawBody, signatureHeader) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Invalid webhook signature");
  }

  if (!signatureHeader || typeof signatureHeader !== "string") {
    throw new Error("Invalid webhook signature");
  }

  const bodyBuf = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(String(rawBody));

  const expected = crypto
    .createHmac("sha256", secret)
    .update(bodyBuf)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader.trim(), "utf8");

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("Invalid webhook signature");
  }
};

// Buyer makes payment → money goes to escrow
export const createRazorpayOrder = async (user, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  if (order.buyerId !== user.id) {
    throw new Error("Only buyer can pay");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment && existingPayment.status === "SUCCESS") {
    throw new Error("Already paid");
  }

  if (existingPayment?.razorpayOrderId) {
    const existingRzOrder = await razorpay.orders.fetch(
      existingPayment.razorpayOrderId
    );

    return {
      razorpayOrderId: existingRzOrder.id,
      amount: existingRzOrder.amount,
      currency: existingRzOrder.currency,
    };
  }

  // Razorpay expects amount in paise
  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: orderId,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  await prisma.payment.upsert({
    where: { orderId },
    update: {
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      method: "RAZORPAY",
      status: "PENDING",
    },
    create: {
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      method: "RAZORPAY",
      status: "PENDING",
    },
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
};
export const verifyPayment = async (user, data) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = data;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  return await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findUnique({
      where: { orderId },
    });
    if (
  existingPayment?.razorpayOrderId &&
  existingPayment.razorpayOrderId !== razorpay_order_id
) {
  throw new Error("Invalid Razorpay order id");
}
    if (existingPayment?.status === "SUCCESS") {
      return existingPayment;
    }

    const order = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    if (order.buyerId !== user.id) {
      throw new Error("Unauthorized");
    }

    const rzOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (rzOrder?.receipt && rzOrder.receipt !== orderId) {
      throw new Error("Invalid payment receipt");
    }

    const expectedPaise = Math.round(order.totalAmount * 100);
    if (rzOrder?.amount != null && Number(rzOrder.amount) !== expectedPaise) {
      throw new Error("Payment amount mismatch");
    }

    

    await tx.payment.upsert({
      where: { orderId },
      update: { razorpayOrderId: razorpay_order_id },
      create: {
        orderId,
        amount: order.totalAmount,
        method: "RAZORPAY",
        status: "PENDING",
        razorpayOrderId: razorpay_order_id,
      },
    });

    const { payment } = await finalizeCapturedRazorpayPayment(
      tx,
      orderId,
      razorpay_payment_id,
      razorpay_order_id
    );

    logger.info({
      message: "Payment verified",
      orderId,
      paymentId: razorpay_payment_id,
    });

    return payment;
  });
};

export const handleRazorpayWebhook = async (rawBodyBuffer, signatureHeader) => {
  verifyRazorpayWebhookSignature(rawBodyBuffer, signatureHeader);

  let payload;
  try {
    const str = Buffer.isBuffer(rawBodyBuffer)
      ? rawBodyBuffer.toString("utf8")
      : String(rawBodyBuffer);
    payload = JSON.parse(str);
  } catch {
    throw new Error("Invalid webhook payload");
  }

  if (payload.event !== "payment.captured") {
    return { processed: false, event: payload.event };
  }

  const paymentEntity = payload?.payload?.payment?.entity;
  if (!paymentEntity?.id || !paymentEntity?.order_id) {
    throw new Error("Invalid payment payload");
  }

  const razorpay_payment_id = paymentEntity.id;
  const razorpay_order_id = paymentEntity.order_id;
  const amountPaise = paymentEntity.amount;

  const rzOrder = await razorpay.orders.fetch(razorpay_order_id);
  const internalOrderId = rzOrder.receipt;

  if (!internalOrderId || typeof internalOrderId !== "string") {
    throw new Error("Order mapping not found");
  }

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: internalOrderId },
    });

    if (!order) throw new Error("Order not found");

    const existingPayment = await tx.payment.findUnique({
      where: { orderId: internalOrderId },
    });

    if (existingPayment?.webhookProcessed === true) {
      return { processed: true };
    }

    if (amountPaise != null) {
      const expectedPaise = Math.round(order.totalAmount * 100);
      if (Number(amountPaise) !== expectedPaise) {
        throw new Error("Payment amount mismatch");
      }
    }

    if (existingPayment?.razorpayOrderId && existingPayment.razorpayOrderId !== razorpay_order_id) {
      throw new Error("Invalid Razorpay order id");
    }

    if (!existingPayment) {
      throw new Error("Payment record not initialized");
    }
    
    await tx.payment.update({
      where: { orderId: internalOrderId },
      data: {
        razorpayOrderId: razorpay_order_id,
      },
    });
    const updated = await tx.payment.updateMany({
      where: {
        orderId: internalOrderId,
        webhookProcessed: false,
      },
      data: {
        webhookProcessed: true,
      },
    });
    
    if (updated.count === 0) {
      return { processed: true };
    }
    
    await finalizeCapturedRazorpayPayment(
      tx,
      internalOrderId,
      razorpay_payment_id,
      razorpay_order_id
    );

    logger.info({
      message: "Webhook processed",
      orderId: internalOrderId,
      razorpay_payment_id,
    });
    return { processed: true };
  });
};
// Buyer confirms delivery → release money
export const confirmDelivery = async () => {
  throw new Error("Disabled: Use OTP verification to complete delivery");
};

// Refund logic
export const refundPayment = async (orderId) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { orderId },
    });

    if (!payment) throw new Error("Payment not found");

    if (payment.escrowStatus !== "HELD") {
      throw new Error("Cannot refund");
    }

    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, listingId: true, quantity: true },
    });

    if (!order) throw new Error("Order not found");

    await restoreInventory(tx, order.listingId, order.quantity, {
      orderId,
      reason: "refund",
    });

    await tx.payment.update({
      where: { orderId },
      data: {
        escrowStatus: "REFUNDED",
        status: "REFUNDED",
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
      },
    });

    return { message: "Refund successful" };
  });
};