import { z } from "zod";

// freemium usages and limit schema and type
export const freemiumUsagesAndLimitSchema = z.object({
  usages: z.object({}),
  limit: z.object({}),
});
export type FreemiumUsagesAndLimit = z.infer<
  typeof freemiumUsagesAndLimitSchema
>;
export const plans = [
  "Gleynr Free",
  "Gleynr Essential",
  "Gleynr Connect",
  "Gleynr Custom",
];

export const planSchema = z.object({
  id: z.string(),
  plan: z.enum(plans),
  type: z.enum(["Freemium", "Premium"]),
  priceHistory: z.array(
    z.object({
      price: z.number(),
      effectiveFrom: z.date(),
      effectiveTill: z.date().nullable(),
    }),
  ),
});

// subscription schema and type
export const subscriptionSchema = z.object({
  id: z.string(),
  planId: z.string(),
  plan: z.enum(plans),
  type: z.enum(["Freemium", "Premium"]),
  billingInterval: z.enum(["Monthly"]).default("Monthly"),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.enum(["Active", "Inactive", "Cancelled", "Expired"]),
  freemiumUsagesAndLimit: freemiumUsagesAndLimitSchema.optional(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;
