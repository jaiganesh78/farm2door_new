import { z } from "zod";

const deliveryStatusSchema = z.enum(
  ["IN_TRANSIT", "DELIVERED"],
  { message: "Invalid delivery status" }
);

export const updateStatusSchema = z.object({
  body: z.object({
    status: deliveryStatusSchema,
    proofImageUrl: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid delivery id"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    otp: z.string().min(1, "OTP is required"),
  }),
  params: z.object({
    id: z.string().uuid("Invalid delivery id"),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid delivery id"),
  }),
});

export const deliveryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid delivery id"),
  }),
});

export const pickupOtpRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid delivery id"),
  }),
});

export const verifyPickupOtpBodySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid delivery id"),
  }),
  body: z.object({
    otp: z
      .string()
      .regex(/^\d{4}$/, "OTP must be exactly 4 digits"),
  }),
});
