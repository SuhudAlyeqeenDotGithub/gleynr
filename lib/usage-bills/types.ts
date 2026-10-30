import type { Usage, UsageRates } from "@/lib/schemaAndTypes/zod/usage";

export type BillingStatus =
  | "In Progress"
  | "Awaiting Calculation"
  | "Calculated"
  | "Charged"
  | "Not Charged";

export type MetricGroupId = "database" | "backend";

// How a metric's raw quantity is converted before a per-unit rate is applied.
export type RateBasis = "per1M" | "perGB" | "perHour";

export type MetricDefinition = {
  key: string;
  group: MetricGroupId;
  label: string;
  unit: string;
  rateBasis: RateBasis;
  read: (usage: Usage) => { unit: string; value: number; estimateRate: number };
  finalRate: (rates: UsageRates) => number;
};

export type BillingPeriod = {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  status: BillingStatus;
  planName: string;
  baseSubscriptionPrice: number;
  currency: string;
  usage: Usage;
  // Monthly rates; only used once the period is calculated.
  rates: UsageRates;
};

export type MetricLine = {
  key: string;
  label: string;
  quantity: string;
  cost: number | null;
};

export type BreakdownGroup = {
  id: MetricGroupId;
  label: string;
  lines: MetricLine[];
  subtotal: number | null;
};

export type PeriodBreakdown = {
  basis: "estimate" | "final" | "pending";
  groups: BreakdownGroup[];
  usageTotal: number | null;
};
