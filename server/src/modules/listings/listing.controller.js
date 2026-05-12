import * as listingService from "./listing.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createListing = asyncHandler(async (req, res) => {
  const listing = await listingService.createListing(
    req.user.id,
    req.body
  );

  res.json({
    success: true,
    data: listing,
  });
});

export const getAllListings = asyncHandler(async (req, res) => {
  const listings = await listingService.getAllListings(req.query);

  res.json({
    success: true,
    data: listings,
  });
});

export const getListingById = asyncHandler(async (req, res) => {
  const listing = await listingService.getListingById(req.params.id);

  res.json({
    success: true,
    data: listing,
  });
});

export const updateListing = asyncHandler(async (req, res) => {
  const updated = await listingService.updateListing(
    req.user.id,
    req.params.id,
    req.body
  );

  res.json({
    success: true,
    data: updated,
  });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const result = await listingService.deleteListing(
    req.user.id,
    req.params.id
  );

  res.json({
    success: true,
    data: result,
  });
});

export const uploadImage = asyncHandler(async (req, res) => {
  const imageUrl = req.file?.path;
  if (!imageUrl) {
    const err = new Error("No file provided");
    err.statusCode = 400;
    throw err;
  }

  const data = await listingService.uploadListingImage(
    req.user.id,
    req.params.id,
    imageUrl
  );

  res.json({ success: true, data });
});