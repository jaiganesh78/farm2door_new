import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(1, "Phone is required"),
    role: z.enum(["FARMER", "BUYER", "DELIVERY","ADMIN"], {
      message: "Invalid role",
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});
