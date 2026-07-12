import { z } from "zod";

export const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  cargoWeight: z.number().positive("Cargo weight must be positive"),
  plannedDistance: z.number().positive("Planned distance must be positive"),
});

export const completeTripSchema = z.object({
  finalOdometer: z.number().nonnegative("Enter a valid odometer reading"),
  fuelConsumed: z.number().nonnegative("Enter a valid fuel amount"),
});
