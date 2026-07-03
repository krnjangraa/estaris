import { z } from "zod";

export const paymentSchema = z.object({
  billing_month: z.coerce
    .number()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),

  billing_year: z.coerce
    .number()
    .min(2024, "Year must be 2024 or later"),

  amount_due: z.coerce
    .number()
    .min(0, "Amount due must be positive")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  amount_paid: z.coerce
    .number()
    .min(0, "Amount paid must be 0 or positive"),

  payment_date: z
    .string()
    .min(1, "Payment date is required"),

  payment_method: z.enum(["cash", "upi", "bank_transfer", "card"]),

  status: z.enum(["pending", "paid", "overdue"]),

  transaction_reference: z.string().optional(),

  remarks: z.string().optional(),
});

export type PaymentInput = z.input<typeof paymentSchema>;
export type PaymentSchema = z.output<typeof paymentSchema>;
