import { z } from "zod";

export const buildingSchema = z.object({
  name: z
    .string()
    .min(2, "Building name is required"),

  address: z
    .string()
    .min(5, "Address is required"),
});

export type BuildingSchema = z.infer<
  typeof buildingSchema
>;