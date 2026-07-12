import { z } from "zod";

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(3, "Registration number is required"),
  name: z.string().min(1, "Name/model is required"),
  type: z.string().min(1, "Type is required"),
  maxLoadCapacity: z.number().positive("Capacity must be positive"),
  odometer: z.number().nonnegative().default(0),
  acquisitionCost: z.number().nonnegative("Enter a valid cost"),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]).default("AVAILABLE"),
});

export const updateVehicleSchema = createVehicleSchema.partial();
