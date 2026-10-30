import { MOCK_PLANS } from "./mock/plans";
import type {
  EntitlementItem,
  EntitlementValue,
  PlanChangeKind,
  PlanDefinition,
  SubscriptionRecord,
} from "./types";

export const getPlan = (name: string) =>
  MOCK_PLANS.find((plan) => plan.name === name);

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatPrice = (price: number | null, currency: string) => {
  if (price === null) return "Price TBC";
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    price,
  );
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const lastDay = new Date(
    next.getFullYear(),
    next.getMonth() + 1,
    0,
  ).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
};

export const nextBillingDate = (startDate: Date, from = new Date()) => {
  let months = 1;
  let next = addMonths(startDate, months);
  while (next <= from) next = addMonths(startDate, ++months);
  return next;
};

export const getPlanRank = (name: string) =>
  MOCK_PLANS.findIndex((plan) => plan.name === name);

export const getChangeKind = (
  currentName: string,
  targetName: string,
): PlanChangeKind =>
  getPlanRank(targetName) > getPlanRank(currentName) ? "upgrade" : "downgrade";

// Upgrades apply now; downgrades and cancellations apply at the end of the paid period.
export const getEffectiveDate = (
  subscription: SubscriptionRecord,
  kind: PlanChangeKind | "cancel",
) =>
  kind === "upgrade" || subscription.type === "Freemium"
    ? new Date()
    : nextBillingDate(subscription.startDate);

export const getEntitlementValue = (
  plan: PlanDefinition,
  item: EntitlementItem,
): EntitlementValue => {
  if (item.kind === "allowance") {
    const limit = plan.limits[item.key] ?? null;
    return limit === null ? { state: "tbc" } : { state: "limit", limit };
  }
  const included = plan.features[item.key];
  if (included === undefined) return { state: "tbc" };
  return { state: included ? "included" : "excluded" };
};

export const formatEntitlementValue = (value: EntitlementValue) => {
  switch (value.state) {
    case "limit":
      return value.limit === "unlimited"
        ? "Unlimited"
        : value.limit.toLocaleString("en-GB");
    case "included":
      return "Included";
    case "excluded":
      return "Not included";
    default:
      return "To be confirmed";
  }
};

export const describeEntitlementChange = (
  item: EntitlementItem,
  from: EntitlementValue,
  to: EntitlementValue,
) => {
  if (from.state === "tbc" || to.state === "tbc") return null;
  if (formatEntitlementValue(from) === formatEntitlementValue(to)) return null;
  return `${item.label}: ${formatEntitlementValue(from)} → ${formatEntitlementValue(to)}`;
};
