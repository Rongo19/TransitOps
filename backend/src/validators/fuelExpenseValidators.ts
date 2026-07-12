import { z } from "zod";

export const createFuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  liters: z.number().positive("Enter liters"),
  cost: z.number().positive("Enter cost"),
});

export const createExpenseSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  amount: z.number().nonnegative("Enter a valid amount"),
});
