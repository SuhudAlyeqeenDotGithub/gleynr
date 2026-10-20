import {z} from "zod"
import { floorSchema } from "./floor"

// site schema and type
export const siteSchema = z.object({
    id: z.string(),
    name: z.string(),
    floors: z.array(floorSchema),
})
export type Site = z.infer<typeof siteSchema>


