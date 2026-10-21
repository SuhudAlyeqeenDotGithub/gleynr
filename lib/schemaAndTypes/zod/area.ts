import {z} from "zod"
import { eventSchema } from "./event"

// area schema and type
export const areaSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    genderGroup: z.enum(["Gents", "Ladies", "Unisex", "Accessible", "Other", "Unknown"]),
    events: z.array(eventSchema),
})
export type Area = z.infer<typeof areaSchema>
