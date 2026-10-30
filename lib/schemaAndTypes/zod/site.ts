import { z } from "zod";
import { floorSchema } from "./floor";

// site schema and type
export const siteSchema = z.object({
  id: z.string(),
  organisationId: z.string(),
  name: z.string(),
  floors: z.array(floorSchema),
});
export type Site = z.infer<typeof siteSchema>;

// site form (create / settings) schema and type
export const siteFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a site name of at least 2 characters.")
    .max(60, "Keep the name under 60 characters."),
  location: z.string().trim().min(1, "Choose a location."),
});
export type SiteFormValues = z.infer<typeof siteFormSchema>;
