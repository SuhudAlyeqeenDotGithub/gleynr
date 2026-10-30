// MOCK DATA: illustrative invoices. Replace with backend data; not tied to real schemas.
import { MOCK_PLANS } from "@/lib/plans/mock/plans";
import { buildBreakdown } from "@/lib/usage-bills/calculations";
import { createMockBillingPeriods } from "@/lib/usage-bills/mock/periods";
import { getChargesTotal } from "../selectors";
import type {
  BillingSnapshot,
  InvoiceRecord,
  InvoiceStatus,
  PaymentAttempt,
} from "../types";

const OLD_BILLING: BillingSnapshot = {
  name: "Northstar Workspace Ltd",
  email: "accounts@northstar.example",
  address: "Unit 3, 88 Old Street",
  city: "London",
  postalCode: "EC1V 9AB",
};

const NEW_BILLING: BillingSnapshot = {
  name: "Northstar Workspace Ltd",
  email: "finance@northstar.example",
  address: "14 Canal Street",
  city: "London",
  postalCode: "EC2A 4RT",
};

type Scenario =
  | "paid"
  | "paidAfterRetry"
  | "pending"
  | "failed"
  | "actionRequired"
  | "notCharged";

const SCENARIO_STATUS: Record<Scenario, InvoiceStatus> = {
  paid: "Paid",
  paidAfterRetry: "Paid",
  pending: "Pending",
  failed: "Failed",
  actionRequired: "Action Required",
  notCharged: "Not Charged",
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const buildAttempts = (
  scenario: Scenario,
  invoiceId: string,
  date: Date,
  amount: number,
): PaymentAttempt[] => {
  const attempt = (
    index: number,
    offset: number,
    outcome: PaymentAttempt["outcome"],
    note?: string,
  ): PaymentAttempt => ({
    id: `${invoiceId}-pa-${index}`,
    date: addDays(date, offset),
    amount,
    outcome,
    note,
  });
  const declined = "Card declined by the issuing bank (insufficient funds).";
  switch (scenario) {
    case "paid":
      return [attempt(1, 0, "Succeeded")];
    case "paidAfterRetry":
      return [attempt(1, 0, "Failed", declined), attempt(2, 3, "Succeeded")];
    case "pending":
      return [
        attempt(
          1,
          0,
          "Processing",
          "Payment submitted; awaiting bank confirmation.",
        ),
      ];
    case "failed":
      return [
        attempt(1, 0, "Failed", declined),
        attempt(2, 3, "Failed", declined),
        attempt(3, 7, "Failed", declined),
      ];
    case "actionRequired":
      return [
        attempt(
          1,
          0,
          "Action Required",
          "The card on file has expired. Update the payment method to continue.",
        ),
      ];
    default:
      return [];
  }
};

type Spec = {
  // Billing period start (the 12th of this month).
  year: number;
  month: number;
  scenario: Scenario;
  plan: string;
  // Usage charges for periods not covered by the Usage & Bills mock data.
  usage?: number;
  additional?: { label: string; amount: number }[];
};

// Newest first.
const SPECS: Spec[] = [
  { year: 2026, month: 7, scenario: "pending", plan: "Gleynr Essential" },
  {
    year: 2026,
    month: 6,
    scenario: "paidAfterRetry",
    plan: "Gleynr Essential",
  },
  {
    year: 2026,
    month: 5,
    scenario: "paid",
    plan: "Gleynr Essential",
    additional: [{ label: "Internal user tokens (5 × £2.00)", amount: 10 }],
  },
  { year: 2026, month: 4, scenario: "paid", plan: "Gleynr Essential" },
  { year: 2026, month: 3, scenario: "notCharged", plan: "Gleynr Essential" },
  { year: 2026, month: 2, scenario: "paid", plan: "Gleynr Essential" },
  { year: 2026, month: 1, scenario: "paid", plan: "Gleynr Connect" },
  {
    year: 2026,
    month: 0,
    scenario: "failed",
    plan: "Gleynr Connect",
    usage: 31.25,
    additional: [{ label: "External user tokens (2 × £3.00)", amount: 6 }],
  },
  {
    year: 2025,
    month: 11,
    scenario: "actionRequired",
    plan: "Gleynr Connect",
    usage: 27.6,
  },
  {
    year: 2025,
    month: 10,
    scenario: "paid",
    plan: "Gleynr Connect",
    usage: 24.15,
  },
  {
    year: 2025,
    month: 9,
    scenario: "paid",
    plan: "Gleynr Connect",
    usage: 18.4,
  },
];

export const createMockInvoices = (): InvoiceRecord[] => {
  const periods = createMockBillingPeriods();
  const total = SPECS.length;

  return SPECS.map((spec, index) => {
    const periodStart = new Date(spec.year, spec.month, 12);
    const periodEnd = new Date(spec.year, spec.month + 1, 11);
    const invoiceDate = addDays(periodEnd, 1);
    const id = `inv-${spec.year}-${String(spec.month + 1).padStart(2, "0")}`;
    const billPeriod = periods.find(
      (item) =>
        item.startDate.getFullYear() === spec.year &&
        item.startDate.getMonth() === spec.month,
    );
    const usage =
      spec.usage ??
      (billPeriod ? (buildBreakdown(billPeriod).usageTotal ?? 0) : 0);
    const charges = {
      baseSubscription:
        MOCK_PLANS.find((plan) => plan.name === spec.plan)?.monthlyPrice ?? 0,
      usage,
      additional: spec.additional ?? [],
    };
    const amount = getChargesTotal(charges);
    const attempts = buildAttempts(spec.scenario, id, invoiceDate, amount);
    const success = attempts.find((item) => item.outcome === "Succeeded");

    return {
      id,
      organisationId: "org-demo",
      billId: `bill-${id}`,
      number: `INV-${invoiceDate.getFullYear()}-${String(total - index).padStart(4, "0")}`,
      period: periodStart.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }),
      periodStart,
      periodEnd,
      chargedDate: invoiceDate,
      successfulDate: success?.date,
      amount,
      amountCurrency: "GBP",
      gbpToUsdExchangeRate: 1.27,
      status: SCENARIO_STATUS[spec.scenario],
      billing: invoiceDate < new Date(2026, 2, 1) ? OLD_BILLING : NEW_BILLING,
      charges,
      attempts,
    };
  });
};
