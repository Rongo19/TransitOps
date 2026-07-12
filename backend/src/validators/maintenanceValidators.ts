import { z } from "zod";

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceType: z.string().min(1, "Service type is required"),
  cost: z.number().nonnegative("Enter a valid cost"),
  date: z.string().min(1, "Date is required"),
});
