import { z } from "zod";
import { currencies } from "./usage";

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
      currency: z.enum(currencies).default("GBP"),
    }),
  ),
  entitlements: z.array(z.string()),
});
export type Plan = z.infer<typeof planSchema>;

// subscription schema and type
export const subscriptionSchema = z.object({
  id: z.string(),
  organisationId: z.string(),
  planId: z.string(),
  plan: z.enum(plans),
  type: z.enum(["Freemium", "Premium"]),
  billingInterval: z.enum(["Monthly"]).default("Monthly"),
  startDate: z.date(),
  cancellationDate: z.date().optional(),
  status: z.enum(["Active", "Cancelled", "Expired", "Upgraded", "Downgraded"]),
  freemiumUsagesAndLimit: freemiumUsagesAndLimitSchema.optional(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;
