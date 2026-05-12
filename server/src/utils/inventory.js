import logger from "./logger.js";

const normalizeQuantity = (input) => {
  const n = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(n)) {
    const err = new Error("Invalid quantity");
    err.statusCode = 400;
    throw err;
  }
  if (n <= 0) {
    const err = new Error("Quantity must be greater than 0");
    err.statusCode = 400;
    throw err;
  }

  // prevent excessive decimal precision causing corruption
  const scaled = n * 1000;
  if (Math.abs(scaled - Math.round(scaled)) > 1e-9) {
    const err = new Error("Invalid quantity precision");
    err.statusCode = 400;
    throw err;
  }

  return Math.round(scaled) / 1000;
};

const oversellError = () => {
  const err = new Error("Not enough stock available");
  err.statusCode = 409;
  return err;
};

export const reserveInventory = async (tx, listingId, quantity, meta = {}) => {
  const qty = normalizeQuantity(quantity);

  const updated = await tx.listing.updateMany({
    where: {
      id: listingId,
      availableQuantity: { gte: qty },
    },
    data: {
      availableQuantity: { decrement: qty },
      reservedQuantity: { increment: qty },
    },
  });

  if (updated.count === 0) {
    logger.warn({
      message: "Inventory reservation failed",
      listingId,
      qty,
      ...meta,
    });
    throw oversellError();
  }

  logger.info({
    message: "Inventory reserved",
    listingId,
    qty,
    ...meta,
  });

  return qty;
};

export const restoreInventory = async (tx, listingId, quantity, meta = {}) => {
  const qty = normalizeQuantity(quantity);

  const updated = await tx.listing.updateMany({
    where: {
      id: listingId,
      reservedQuantity: { gte: qty },
    },
    data: {
      availableQuantity: { increment: qty },
      reservedQuantity: { decrement: qty },
    },
  });

  if (updated.count === 0) {
    logger.warn({
      message: "Inventory restoration failed",
      listingId,
      qty,
      ...meta,
    });
    const err = new Error("Invalid reservation state");
    err.statusCode = 409;
    throw err;
  }

  logger.info({
    message: "Inventory restored",
    listingId,
    qty,
    ...meta,
  });

  return qty;
};

export const finalizeInventory = async (tx, listingId, quantity, meta = {}) => {
  const qty = normalizeQuantity(quantity);

  const updated = await tx.listing.updateMany({
    where: {
      id: listingId,
      reservedQuantity: { gte: qty },
    },
    data: {
      reservedQuantity: { decrement: qty },
    },
  });

  if (updated.count === 0) {
    logger.warn({
      message: "Inventory finalization failed",
      listingId,
      qty,
      ...meta,
    });
    const err = new Error("Invalid reservation state");
    err.statusCode = 409;
    throw err;
  }

  logger.info({
    message: "Inventory finalized",
    listingId,
    qty,
    ...meta,
  });

  return qty;
};

