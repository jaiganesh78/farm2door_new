import prisma from "../../config/prisma.js";

export const getMyOrders = async (user) => {
  let where = {};
  
  if (user.role === "BUYER") {
    where = { buyerId: user.id };
  } else if (user.role === "FARMER") {
    where = { farmerId: user.id };
  } else if (user.role === "ADMIN") {
    where = {};
  } else {
    return [];
  }

  return await prisma.order.findMany({
    where,
    include: {
      listing: true,
      buyer: {
        select: { id: true, name: true, email: true }
      },
      farmer: {
        select: { id: true, name: true, email: true }
      },
      payment: true,
      delivery: true
    },
    orderBy: { createdAt: "desc" }
  });
};

export const getOrderById = async (user, id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      listing: true,
      buyer: {
        select: { id: true, name: true, email: true }
      },
      farmer: {
        select: { id: true, name: true, email: true }
      },
      payment: true,
      delivery: true
    }
  });

  if (!order) throw new Error("Order not found");

  if (
    user.role !== "ADMIN" &&
    order.buyerId !== user.id &&
    order.farmerId !== user.id
  ) {
    throw new Error("Unauthorized");
  }

  return order;
};
