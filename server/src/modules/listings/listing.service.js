import prisma from "../../config/prisma.js";
import {
  getCache,
  invalidateListingCaches,
  setCache,
} from "../../utils/cache.js";

const LISTINGS_CACHE_TTL = 60;

export const createListing = async (userId, data) => {
  const {
    productName,
    description,
    pricePerUnit,
    unit,
    totalQuantity,
    latitude,
    longitude,
    negotiable,
  } = data;

  if (pricePerUnit <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (totalQuantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const listing = await prisma.listing.create({
    data: {
      farmerId: userId,
      productName,
      description,
      pricePerUnit,
      unit,
      totalQuantity,
      availableQuantity: totalQuantity,
      latitude,
      longitude,
      negotiable,
    },
  });

  await invalidateListingCaches(listing.id);

  return listing;
};

export const getAllListings = async (query) => {
  const normalizedQuery = Object.keys(query)
  .sort()
  .reduce((acc, key) => {
    acc[key] = query[key];
    return acc;
  }, {});

const cacheKey = `listings:${JSON.stringify(normalizedQuery)}`;
  const cached = await getCache(cacheKey);
if (cached !== null) {
  console.log("CACHE HIT:", cacheKey);
  return cached;
}

console.log("CACHE MISS:", cacheKey);

  const { search, minPrice, maxPrice, minQty } = query;

  const where = {};

  if (search) {
    where.productName = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (minPrice || maxPrice) {
    where.pricePerUnit = {};
    if (minPrice) where.pricePerUnit.gte = parseFloat(minPrice);
    if (maxPrice) where.pricePerUnit.lte = parseFloat(maxPrice);
  }

  if (minQty) {
    where.availableQuantity = {
      gte: parseFloat(minQty),
    };
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(cacheKey, listings, LISTINGS_CACHE_TTL);

  return listings;
};

export const getListingById = async (id) => {
  const singleKey = `listing:${id}`;
  const cached = await getCache(singleKey);
if (cached !== null) {
  console.log("CACHE HIT:", singleKey);
  return cached;
}

console.log("CACHE MISS:", singleKey);

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  await setCache(singleKey, listing, LISTINGS_CACHE_TTL);

  return listing;
};

export const updateListing = async (userId, id, data) => {
  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.farmerId !== userId) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.listing.update({
    where: { id },
    data,
  });

  await invalidateListingCaches(id);

  return updated;
};

export const deleteListing = async (userId, id) => {
  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.farmerId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.listing.delete({
    where: { id },
  });

  await invalidateListingCaches(id);

  return { message: "Listing deleted successfully" };
};

export const uploadListingImage = async (userId, listingId, imageUrl) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    const err = new Error("Listing not found");
    err.statusCode = 404;
    throw err;
  }

  if (listing.farmerId !== userId) {
    const err = new Error("Unauthorized");
    err.statusCode = 403;
    throw err;
  }

  const { safeDeleteCloudinaryImageByUrl } = await import(
    "../../utils/cloudinary.utils.js"
  );

  if (listing.imageUrl) {
    await safeDeleteCloudinaryImageByUrl(listing.imageUrl);
  }

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: { imageUrl },
  });

  await invalidateListingCaches(listingId);

  return { imageUrl: updated.imageUrl };
};