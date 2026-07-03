import { z } from "zod";

export const roomSchema = z.object({
  room_number: z
    .string()
    .min(1, "Room number is required"),

  room_type: z
    .string()
    .min(1, "Room type is required"),

  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1"),

  base_rent: z.coerce
    .number()
    .positive("Rent must be greater than 0"),
});

export type RoomInput = z.input<typeof roomSchema>;
export type RoomSchema = z.output<typeof roomSchema>;