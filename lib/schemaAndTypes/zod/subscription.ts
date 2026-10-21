import {z} from "zod"

// freemium usages and limit schema and type
export const freemiumUsagesAndLimitSchema = z.object({
    usages: z.object({}),
    limit: z.object({}),
})
export type FreemiumUsagesAndLimit = z.infer<typeof freemiumUsagesAndLimitSchema>


// subscription schema and type
export const subscriptionSchema = z.object({
    id: z.string(),
    period: z.enum(["Monthly", "Yearly"]),
    type: z.enum(["Freemium", "Premium"]),
    plan: z.enum(["Free", "Basic", "Premium", "Enterprise"]),
    startDate: z.date(),
    endDate: z.date().optional(),
    status: z.enum(["Active", "Inactive", "Cancelled", "Expired"]),
    freemiumUsagesAndLimit: freemiumUsagesAndLimitSchema.optional(),
})
export type Subscription = z.infer<typeof subscriptionSchema>