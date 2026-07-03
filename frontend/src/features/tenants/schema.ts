import { z } from "zod";

export const tenantSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  permanent_address: z
    .string()
    .min(5, "Address is required"),

  contact_number: z
    .string()
    .min(10, "Invalid contact number"),

  emergency_contact_name: z
    .string()
    .min(2, "Emergency contact name is required"),

  emergency_contact_number: z
    .string()
    .min(10, "Invalid emergency contact"),

  id_proof_type: z
    .string()
    .min(2, "ID proof type is required"),

  id_proof_number: z
    .string()
    .min(2, "ID proof number is required"),

  move_in_date: z.string(),
});

export type TenantSchema = z.infer<
  typeof tenantSchema
>;