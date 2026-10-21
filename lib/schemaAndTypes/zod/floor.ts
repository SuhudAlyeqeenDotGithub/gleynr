import { z } from "zod";
import { areaSchema } from "./area";

// floor schema and type
export const floorSchema = z.object({
  id: z.string(),
  name: z.string(),
  areas: z.array(areaSchema),
});
export type Floor = z.infer<typeof floorSchema>;

// floor form (create / edit) schema and type
export const floorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a floor name.")
    .max(60, "Keep the name under 60 characters."),
});
export type FloorFormValues = z.infer<typeof floorFormSchema>;
