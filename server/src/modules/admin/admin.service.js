import prisma from "../../config/prisma.js";

const deliveryPublicFields = (delivery) => {
  if (!delivery) return null;

  return {
    id: delivery.id,
    orderId: delivery.orderId,
    deliveryPartnerId: delivery.deliveryPartnerId,
    pickupLat: delivery.pickupLat,
    pickupLng: delivery.pickupLng,
    dropLat: delivery.dropLat,
    dropLng: delivery.dropLng,
    status: delivery.status,
    proofImageUrl: delivery.proofImageUrl,
    assignedAt: delivery.assignedAt,
    deliveredAt: delivery.deliveredAt,
  };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      rating: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
};

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
      farmer: {
        select: {
          name: true,
          email: true,
        },
      },
      payment: true,
      delivery: true,
      listing: {
        select: {
          id: true,
          productName: true,
          unit: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    listingId: order.listingId,
    buyerId: order.buyerId,
    farmerId: order.farmerId,
    negotiationId: order.negotiationId,
    price: order.price,
    quantity: order.quantity,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    listing: order.listing,
    buyer: order.buyer,
    farmer: order.farmer,
    payment: order.payment
  ? {
      id: order.payment.id,
      amount: order.payment.amount,
      method: order.payment.method,
      status: order.payment.status,
      escrowStatus: order.payment.escrowStatus,
      createdAt: order.payment.createdAt,
    }
  : null,
    delivery: deliveryPublicFields(order.delivery),
  }));
};

export const getAllDeliveries = async () => {
  const deliveries = await prisma.delivery.findMany({
    orderBy: { assignedAt: "desc" },
    include: {
      order: {
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          farmer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          listing: {
            select: {
              id: true,
              productName: true,
              unit: true,
            },
          },
        },
      },
      deliveryPartner: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  return deliveries.map((d) => deliveryPublicFields(d));
};
