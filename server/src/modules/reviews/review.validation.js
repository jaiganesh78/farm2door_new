import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.coerce
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    comment: z.string().max(5000).optional().nullable(),
  }),
  params: z.object({
    orderId: z.string().uuid("Invalid order id"),
  }),
});
