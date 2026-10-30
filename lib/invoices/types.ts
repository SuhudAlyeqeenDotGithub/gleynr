import type { Invoice } from "@/lib/schemaAndTypes/zod/invoice";

export type InvoiceStatus = Invoice["status"];

export type PaymentAttemptOutcome =
  | "Succeeded"
  | "Failed"
  | "Action Required"
  | "Processing";

export type PaymentAttempt = {
  id: string;
  date: Date;
  amount: number;
  outcome: PaymentAttemptOutcome;
  note?: string;
};

// Billing details as they were when the invoice was issued.
export type BillingSnapshot = {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
};

export type InvoiceCharges = {
  baseSubscription: number;
  usage: number;
  additional: { label: string; amount: number }[];
};

// Extends the stored invoice with the display fields the page needs; `chargedDate` is the invoice date.
export type InvoiceRecord = Omit<Invoice, "successfulDate"> & {
  successfulDate?: Date;
  number: string;
  period: string;
  periodStart: Date;
  periodEnd: Date;
  billing: BillingSnapshot;
  charges: InvoiceCharges;
  attempts: PaymentAttempt[];
  paymentMethodUpdated?: boolean;
};

export type InvoiceFilter = "All" | InvoiceStatus;
