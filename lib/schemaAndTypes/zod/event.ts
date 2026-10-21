import {z} from "zod"

// event schema and type
export const eventSchema = z.object({
    timestamp: z.date(),
    type: z.string(),
    areaId: z.string()
})
export type Event = z.infer<typeof eventSchema>

// floor level events schema and type
export const floorLevelEventSchema = eventSchema.extend({
    floorId: z.string(),
})
export type FloorLevelEvent = z.infer<typeof floorLevelEventSchema>

// site level events schema and type
export const siteLevelEventSchema = floorLevelEventSchema.extend({
    siteId: z.string(),
})
export type SiteLevelEvent = z.infer<typeof siteLevelEventSchema>