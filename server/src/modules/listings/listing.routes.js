import express from "express";
import * as listingController from "./listing.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  createListingSchema,
  updateListingSchema,
  listingIdParamSchema,
} from "./listing.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import { z } from "zod";
import { uploadListingImage } from "../../middleware/upload.middleware.js";
const router = express.Router();

// Create listing (Farmer only)
router.post(
  "/",
  authenticate,
  authorize("FARMER"),
  validate(createListingSchema),
  listingController.createListing
);

// Get all listings (Public)
router.get("/", listingController.getAllListings);

// Get single listing
router.get(
  "/:id",
  validate(listingIdParamSchema),
  listingController.getListingById
);

// Update listing (Farmer only)
router.patch(
  "/:id",
  authenticate,
  authorize("FARMER"),
  validate(
    z.object({
      body: updateListingSchema,
    })
  ),
  listingController.updateListing
);

// Delete listing (Farmer only)
router.delete(
  "/:id",
  authenticate,
  authorize("FARMER"),
  validate(listingIdParamSchema),
  listingController.deleteListing
);

router.post(
  "/:id/image",
  authenticate,
  authorize("FARMER"),
  validate(listingIdParamSchema),
  uploadListingImage.single("image"),
  listingController.uploadImage
);

export default router;