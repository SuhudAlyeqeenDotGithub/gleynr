// MOCK DATA: illustrative usage, rates and billing periods. Replace with backend data; not tied to real schemas.
// Rate conventions: counts per 1M, bytes per GB, durations per hour. Margin/VAT fields are unused by the page.
import type { Usage, UsageRates } from "@/lib/schemaAndTypes/zod/usage";
import { MOCK_PLANS } from "@/lib/plans/mock/plans";
import type { BillingPeriod, BillingStatus } from "../types";

type RateSet = {
  operations: number;
  storage: number;
  request: number;
  response: number;
  duration: number;
  backendRequest: number;
  backendResponse: number;
};

const RATES_BEFORE_JUN: RateSet = {
  operations: 0.32,
  storage: 0.16,
  request: 0.11,
  response: 0.13,
  duration: 0.38,
  backendRequest: 0.11,
  backendResponse: 0.13,
};

const RATES_FROM_JUN: RateSet = {
  operations: 0.3,
  storage: 0.15,
  request: 0.1,
  response: 0.12,
  duration: 0.35,
  backendRequest: 0.1,
  backendResponse: 0.12,
};

const GB = 1024 ** 3;

// Full-month baseline, scaled per period.
const BASELINE = {
  operations: 4_800_000,
  aggregations: 310_000,
  storage: 42 * GB,
  request: 18 * GB,
  response: 64 * GB,
  duration: 86_400_000,
  backendRequest: 12 * GB,
  backendResponse: 30 * GB,
};

const buildUsage = (
  id: string,
  period: string,
  start: Date,
  end: Date,
  factor: number,
  rates: RateSet,
): Usage => {
  const scaled = (value: number) => Math.round(value * factor);
  return {
    id: `usage-${id}`,
    organisationId: "org-demo",
    billId: `bill-${id}`,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    period,
    database: {
      operations: {
        unit: "count",
        value: scaled(BASELINE.operations),
        estimateRate: rates.operations,
      },
      aggregations: {
        unit: "count",
        value: scaled(BASELINE.aggregations),
        estimateRate: rates.operations,
      },
      storageBytes: {
        unit: "bytes",
        value: scaled(BASELINE.storage),
        estimateRate: rates.storage,
      },
      requestBytes: {
        unit: "bytes",
        value: scaled(BASELINE.request),
        estimateRate: rates.request,
      },
      responseBytes: {
        unit: "bytes",
        value: scaled(BASELINE.response),
        estimateRate: rates.response,
      },
    },
    backend: {
      requestDuration: {
        unit: "milliseconds",
        value: scaled(BASELINE.duration),
        estimateRate: rates.duration,
      },
      requestBytes: {
        unit: "bytes",
        value: scaled(BASELINE.backendRequest),
        estimateRate: rates.backendRequest,
      },
      responseBytes: {
        unit: "bytes",
        value: scaled(BASELINE.backendResponse),
        estimateRate: rates.backendResponse,
      },
    },
  };
};

const buildRates = (
  id: string,
  period: string,
  start: Date,
  end: Date,
  rates: RateSet,
): UsageRates => ({
  id: `rates-${id}`,
  databaseOperationsRate: rates.operations,
  databaseStorageGBRate: rates.storage,
  databaseBackupGBRate: 0.05,
  databaseRequestGBRate: rates.request,
  databaseResponseGBRate: rates.response,
  backendRequestDurationRate: rates.duration,
  backendRequestGBRate: rates.backendRequest,
  backendResponseGBRate: rates.backendResponse,
  currency: "GBP",
  periodStart: start.toISOString(),
  periodEnd: end.toISOString(),
  period,
  databaseVatPercentage: 0,
  backendVatPercentage: 0,
  backendMarginPercentage: 0,
  databaseMarginPercentage: 0,
});

// Billing periods run from the 12th to the 11th, matching the subscription start date.
const PERIOD_SPECS: {
  month: number;
  status: BillingStatus;
  plan: string;
  factor: number;
}[] = [
  { month: 9, status: "In Progress", plan: "Gleynr Essential", factor: 0.62 },
  { month: 8, status: "Awaiting Calculation", plan: "Gleynr Essential", factor: 1 },
  { month: 7, status: "Calculated", plan: "Gleynr Essential", factor: 0.94 },
  { month: 6, status: "Charged", plan: "Gleynr Essential", factor: 0.88 },
  { month: 5, status: "Charged", plan: "Gleynr Essential", factor: 0.81 },
  { month: 4, status: "Charged", plan: "Gleynr Essential", factor: 0.77 },
  { month: 3, status: "Not Charged", plan: "Gleynr Essential", factor: 0.7 },
  { month: 2, status: "Charged", plan: "Gleynr Essential", factor: 0.62 },
  { month: 1, status: "Charged", plan: "Gleynr Connect", factor: 0.55 },
];

export const createMockBillingPeriods = (): BillingPeriod[] =>
  PERIOD_SPECS.map(({ month, status, plan, factor }) => {
    const startDate = new Date(2026, month, 12);
    const endDate = new Date(2026, month + 1, 11);
    const label = startDate.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    const id = `2026-${String(month + 1).padStart(2, "0")}`;
    const rateSet = month <= 4 ? RATES_BEFORE_JUN : RATES_FROM_JUN;
    return {
      id,
      label,
      startDate,
      endDate,
      status,
      planName: plan,
      baseSubscriptionPrice:
        MOCK_PLANS.find((item) => item.name === plan)?.monthlyPrice ?? 0,
      currency: "GBP",
      usage: buildUsage(id, label, startDate, endDate, factor, rateSet),
      rates: buildRates(id, label, startDate, endDate, rateSet),
    };
  });
