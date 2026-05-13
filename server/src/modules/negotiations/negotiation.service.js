import prisma from "../../config/prisma.js";
import { reserveInventory } from "../../utils/inventory.js";

// Create Offer (start or continue negotiation)
export const createOffer = async (user, data) => {
  const { listingId, price, quantity ,message} = data;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) throw new Error("Listing not found");

  if (user.role !== "BUYER") {
    throw new Error("Only buyers can initiate offers");
  }

  // Check if negotiation already exists
  let negotiation = await prisma.negotiation.findFirst({
    where: {
      listingId,
      buyerId: user.id,
      status: "ACTIVE",
    },
  });

  if (!negotiation) {
    negotiation = await prisma.negotiation.create({
      data: {
        listingId,
        buyerId: user.id,
        farmerId: listing.farmerId,
      },
    });
  }

  const offer = await prisma.offer.create({
    data: {
      negotiationId: negotiation.id,
      senderRole: "BUYER",
      price,
      quantity,
      message,
    },
  });

  return { negotiation, offer };
};

// Get negotiation details
export const getNegotiation = async (user, id) => {
  const negotiation = await prisma.negotiation.findUnique({
    where: { id },
    include: {
      offers: { orderBy: { createdAt: "asc" } },
      order: true,
      listing: {
        include: {
          farmer: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    }
  });

  if (!negotiation) throw new Error("Not found");

  if (
    negotiation.buyerId !== user.id &&
    negotiation.farmerId !== user.id
  ) {
    throw new Error("Unauthorized");
  }

  return negotiation;
};

// List all negotiations for the current user
export const getMyNegotiations = async (user) => {
  return await prisma.negotiation.findMany({
    where: {
      OR: [
        { buyerId: user.id },
        { farmerId: user.id }
      ]
    },
    include: {
      offers: { orderBy: { createdAt: "asc" } },
      listing: {
        include: {
          farmer: {
            select: { id: true, name: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

// Respond to negotiation
export const respondToOffer = async (user, id, data) => {
  const { action, price, quantity ,message} = data;

  const negotiation = await prisma.negotiation.findUnique({
    where: { id },
  });

  if (!negotiation) throw new Error("Not found");

  if (negotiation.status !== "ACTIVE") {
    throw new Error("Negotiation closed");
  }

  if (user.id !== negotiation.farmerId) {
    throw new Error("Only farmer can respond");
  }
if (action === "ACCEPT") {
  return await prisma.$transaction(async (tx) => {
    const negotiationData = await tx.negotiation.findUnique({
      where: { id },
    });

    if (!negotiationData) throw new Error("Negotiation not found");

    if (negotiationData.status !== "ACTIVE") {
      throw new Error("Negotiation already closed");
    }

    // Get last offer safely
    const lastOffer = await tx.offer.findFirst({
      where: { negotiationId: id },
      orderBy: { createdAt: "desc" },
    });

    if (!lastOffer) throw new Error("No offer found");

    const listing = await tx.listing.findUnique({
      where: { id: negotiationData.listingId },
      select: { id: true },
    });

    if (!listing) throw new Error("Listing not found");

    // Update negotiation
    

    await reserveInventory(tx, listing.id, lastOffer.quantity, {
      negotiationId: id,
      buyerId: negotiationData.buyerId,
    });
    await tx.negotiation.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    // Create order
    const order = await tx.order.create({
      data: {
        listingId: negotiationData.listingId,
        buyerId: negotiationData.buyerId,
        farmerId: negotiationData.farmerId,
        negotiationId: id,
        price: lastOffer.price,
        quantity: lastOffer.quantity,
        totalAmount: lastOffer.price * lastOffer.quantity,
      },
    });

    return { message: "Accepted", order };
  });
}

  if (action === "REJECT") {
    await prisma.negotiation.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return { message: "Rejected" };
  }

  if (action === "COUNTER") {
    const offer = await prisma.offer.create({
      data: {
        negotiationId: id,
        senderRole: "FARMER",
        price,
        quantity,
        message,
      },
    });

    return offer;
  }

  throw new Error("Invalid action");
};