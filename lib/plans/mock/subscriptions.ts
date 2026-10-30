// MOCK DATA: demo subscription history, newest first.
import type { SubscriptionRecord } from "../types";

const base = {
  organisationId: "org-demo",
  billingInterval: "Monthly" as const,
};

export const createMockSubscriptions = (): SubscriptionRecord[] => [
  {
    ...base,
    id: "sub-1006",
    planId: "plan-gleynr-essential",
    plan: "Gleynr Essential",
    type: "Premium",
    startDate: new Date(2026, 2, 12),
    status: "Active",
  },
  {
    ...base,
    id: "sub-1005",
    planId: "plan-gleynr-connect",
    plan: "Gleynr Connect",
    type: "Premium",
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2026, 2, 12),
    status: "Downgraded",
  },
  {
    ...base,
    id: "sub-1004",
    planId: "plan-gleynr-essential",
    plan: "Gleynr Essential",
    type: "Premium",
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 8, 15),
    cancellationDate: new Date(2025, 7, 20),
    status: "Cancelled",
  },
  {
    ...base,
    id: "sub-1003",
    planId: "plan-gleynr-free",
    plan: "Gleynr Free",
    type: "Freemium",
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 5, 1),
    status: "Upgraded",
  },
  {
    ...base,
    id: "sub-1002",
    planId: "plan-gleynr-essential",
    plan: "Gleynr Essential",
    type: "Premium",
    startDate: new Date(2025, 0, 10),
    endDate: new Date(2025, 2, 10),
    status: "Expired",
  },
  {
    ...base,
    id: "sub-1001",
    planId: "plan-gleynr-free",
    plan: "Gleynr Free",
    type: "Freemium",
    startDate: new Date(2024, 8, 1),
    endDate: new Date(2025, 0, 10),
    status: "Upgraded",
  },
];
