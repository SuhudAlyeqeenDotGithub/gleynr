import { z } from "zod";
import { currencies } from "./usage";

export const billSchema = z.object({
  id: z.string(),
  organisationId: z.string(),
  subscriptionId: z.string(),
  periodStartDate: z.date(),
  periodEndDate: z.date(),
  period: z.string(), // e.g., "June 2026"
  status: z.enum(["Charged", "Not Charged"]),
  amount: z.number(),
  amountCurrency: z.enum(currencies).default("GBP"),
  gbpToUsdExchangeRate: z.number(),
});
export type Bill = z.infer<typeof billSchema>;
