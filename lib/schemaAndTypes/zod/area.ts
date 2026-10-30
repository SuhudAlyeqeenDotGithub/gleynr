import { z } from "zod";
import { eventSchema } from "./event";

// gender group schema and type
export const genderGroupSchema = z.enum([
  "Gents",
  "Ladies",
  "Unisex",
  "Accessible",
  "Other",
  "Unknown",
]);
export type GenderGroup = z.infer<typeof genderGroupSchema>;

// area schema and type
export const areaSchema = z.object({
  id: z.string(),
  organisationId: z.string(),
  floorId: z.string(),
  name: z.string(),
  type: z.string(),
  genderGroup: genderGroupSchema,
  events: z.array(eventSchema),
});
export type Area = z.infer<typeof areaSchema>;

// area form (create / edit) schema and type
export const areaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter an area name.")
    .max(60, "Keep the name under 60 characters."),
  type: z.string().trim().min(1, "Choose an area type."),
  genderGroup: genderGroupSchema,
});
export type AreaFormValues = z.infer<typeof areaFormSchema>;
