import { z } from "zod";

export const createOfferSchema = z.object({
  body: z.object({
    listingId: z.string().uuid("Invalid listing id"),
    price: z.coerce.number().positive("Price must be positive"),
    quantity: z.coerce.number().positive("Quantity must be positive"),
    message: z.string().max(2000).optional().nullable(),
  }),
});
