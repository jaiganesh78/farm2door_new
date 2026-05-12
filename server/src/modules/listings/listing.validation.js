import { z } from "zod";

const createListingBodySchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  pricePerUnit: z.coerce.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit is required"),
  totalQuantity: z.coerce.number().positive("Quantity must be positive"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  negotiable: z.boolean().optional(),
});

export const createListingSchema = z.object({
  body: createListingBodySchema,
});

export const updateListingSchema = z.object({
  productName: z.string().min(2).optional(),
  description: z.string().optional(),
  pricePerUnit: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
  totalQuantity: z.number().positive().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  negotiable: z.boolean().optional(),
});
export const listingIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid listing id"),
  }),
});