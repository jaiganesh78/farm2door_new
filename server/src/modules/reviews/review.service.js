import prisma from "../../config/prisma.js";

const assertRating = (rating) => {
  const n = Number(rating);
  if (
    !Number.isFinite(n) ||
    n !== Math.floor(n) ||
    n < 1 ||
    n > 5
  ) {
    throw new Error("rating must be an integer between 1 and 5");
  }
  return n;
};

const recalculateTargetUserRating = async (tx, targetUserId) => {
  const agg = await tx.review.aggregate({
    where: { targetUserId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const avg = agg._avg.rating;
  const nextRating = avg == null ? 0 : Math.round(avg * 100) / 100;

  await tx.user.update({
    where: { id: targetUserId },
    data: { rating: nextRating },
  });

  return nextRating;
};

export const createReview = async (orderId, user, input) => {
  const rating = assertRating(input.rating);
  const comment =
    input.comment == null || input.comment === ""
      ? null
      : String(input.comment).trim() || null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "COMPLETED") {
    throw new Error("Reviews are only allowed for completed orders");
  }

  if (user.id !== order.buyerId && user.id !== order.farmerId) {
    throw new Error("Only the buyer or farmer on this order can leave a review");
  }

  const existing = await prisma.review.findFirst({
    where: {
      orderId,
      reviewerId: user.id,
    },
  });

  if (existing) {
    throw new Error("You have already reviewed this order");
  }

  const targetUserId =
    user.id === order.buyerId ? order.farmerId : order.buyerId;

  return await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        orderId,
        reviewerId: user.id,
        targetUserId,
        rating,
        comment,
      },
    });

    await recalculateTargetUserRating(tx, targetUserId);

    return review;
  });
};

export const getReviewsForUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.review.findMany({
    where: { targetUserId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderId: true,
      reviewerId: true,
      targetUserId: true,
      rating: true,
      comment: true,
      createdAt: true,
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
