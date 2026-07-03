import { z } from "zod";

export const leaseSchema = z.object({
  start_date: z
    .string()
    .min(1, "Start date is required"),

  end_date: z
    .string()
    .min(1, "End date is required"),

  monthly_rent: z.coerce
    .number()
    .positive("Monthly rent must be greater than 0"),

  security_deposit: z.coerce
    .number()
    .min(0, "Security deposit must be 0 or more"),

  payment_due_day: z.coerce
    .number()
    .min(1, "Payment due day must be at least 1")
    .max(31, "Payment due day cannot exceed 31"),
}).refine(
  (data) => {
    if (!data.start_date || !data.end_date) return true;
    return new Date(data.end_date) > new Date(data.start_date);
  },
  {
    message: "End date must be after start date",
    path: ["end_date"],
  }
);

export type LeaseInput = z.input<typeof leaseSchema>;
export type LeaseSchema = z.output<typeof leaseSchema>;
export type LeaseUpdateInput = Partial<LeaseInput>;
