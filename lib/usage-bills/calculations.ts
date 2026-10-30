import { METRICS, METRIC_GROUPS } from "./metrics";
import type {
  BillingPeriod,
  BillingStatus,
  MetricDefinition,
  PeriodBreakdown,
} from "./types";

const GB = 1024 ** 3;
const MB = 1024 ** 2;
const MS_PER_HOUR = 3_600_000;

// Converts a raw quantity to the unit its rate is priced in, rejecting mismatched units.
export const toRateBasis = (
  definition: MetricDefinition,
  unit: string,
  value: number,
) => {
  if (unit !== definition.unit) {
    throw new Error(
      `${definition.key}: expected unit "${definition.unit}" but received "${unit}"`,
    );
  }
  switch (definition.rateBasis) {
    case "per1M":
      return value / 1_000_000;
    case "perGB":
      return value / GB;
    case "perHour":
      return value / MS_PER_HOUR;
  }
};

export const formatQuantity = (unit: string, value: number) => {
  if (unit === "bytes") {
    return value >= GB
      ? `${(value / GB).toFixed(2)} GB`
      : `${(value / MB).toFixed(1)} MB`;
  }
  if (unit === "milliseconds") {
    return `${(value / MS_PER_HOUR).toFixed(1)} hours`;
  }
  return value.toLocaleString("en-GB");
};

export const formatMoney = (amount: number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    amount,
  );

const round2 = (amount: number) => Math.round(amount * 100) / 100;

export const isFinalised = (status: BillingStatus) =>
  status === "Calculated" || status === "Charged" || status === "Not Charged";

// In-progress periods use per-metric estimate rates; finalised periods use the monthly usage rates.
export const buildBreakdown = (period: BillingPeriod): PeriodBreakdown => {
  const basis = isFinalised(period.status)
    ? "final"
    : period.status === "In Progress"
      ? "estimate"
      : "pending";

  const groups = METRIC_GROUPS.map(({ id, label }) => {
    const lines = METRICS.filter((metric) => metric.group === id).map(
      (metric) => {
        const reading = metric.read(period.usage);
        let cost: number | null = null;
        if (basis !== "pending") {
          const rate =
            basis === "estimate"
              ? reading.estimateRate
              : metric.finalRate(period.rates);
          cost = round2(toRateBasis(metric, reading.unit, reading.value) * rate);
        }
        return {
          key: metric.key,
          label: metric.label,
          quantity: formatQuantity(reading.unit, reading.value),
          cost,
        };
      },
    );
    const subtotal =
      basis === "pending"
        ? null
        : round2(lines.reduce((sum, line) => sum + (line.cost ?? 0), 0));
    return { id, label, lines, subtotal };
  });

  const usageTotal =
    basis === "pending"
      ? null
      : round2(groups.reduce((sum, group) => sum + (group.subtotal ?? 0), 0));
  return { basis, groups, usageTotal };
};

export const getPeriodTotal = (
  period: BillingPeriod,
  breakdown: PeriodBreakdown,
) =>
  breakdown.usageTotal === null
    ? null
    : round2(period.baseSubscriptionPrice + breakdown.usageTotal);

export const formatPeriodRange = (period: BillingPeriod) => {
  const fmt = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(period.startDate)} – ${fmt(period.endDate)}`;
};
