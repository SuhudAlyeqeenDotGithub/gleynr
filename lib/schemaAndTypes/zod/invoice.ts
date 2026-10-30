import { z } from "zod";
import { currencies } from "./usage";

export const invoiceSchema = z.object({
  id: z.string(),
  organisationId: z.string(),
  billId: z.string(),
  chargedDate: z.date(),
  successfulDate: z.date(),
  amount: z.number(),
  amountCurrency: z.enum(currencies).default("GBP"),
  gbpToUsdExchangeRate: z.number(),
  status: z.enum([
    "Paid",
    "Not Charged",
    "Pending",
    "Failed",
    "Action Required",
  ]),
});
export type Invoice = z.infer<typeof invoiceSchema>;
