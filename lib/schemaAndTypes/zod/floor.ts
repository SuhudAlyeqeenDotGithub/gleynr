import {z} from "zod"
import { areaSchema } from "./area"


// floor schema and type
export const floorSchema = z.object({
    id: z.string(),
    name: z.string(),
    areas: z.array(areaSchema),
})
export type Floor = z.infer<typeof floorSchema>

