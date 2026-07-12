import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseCategory: z.string().min(1, "Category is required"),
  licenseExpiryDate: z.string().min(1, "Expiry date is required"),
  contactNumber: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  safetyScore: z.number().min(0).max(100).default(100),
  status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]).default("AVAILABLE"),
});

export const updateDriverSchema = createDriverSchema.partial();
