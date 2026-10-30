import type { LucideIcon } from "lucide-react";
import type { Subscription } from "@/lib/schemaAndTypes/zod/plan & subscription";

export type ScheduledChange = {
  kind: "cancel" | "change";
  planName?: string;
  effectiveDate: Date;
};

// Extends the stored subscription with the fields the UI needs for history and scheduling.
export type SubscriptionRecord = Subscription & {
  endDate?: Date;
  scheduledChange?: ScheduledChange;
};

export type PlanChangeKind = "upgrade" | "downgrade";

export type EntitlementItem = {
  key: string;
  label: string;
  kind: "allowance" | "feature";
  unit?: string;
};

export type EntitlementGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: EntitlementItem[];
};

// null = not yet defined (placeholder); "unlimited" = no cap.
export type LimitValue = number | "unlimited" | null;

export type PlanDefinition = {
  id: string;
  name: string;
  type: "Freemium" | "Premium";
  summary: string;
  monthlyPrice: number | null;
  currency: string;
  limits: Record<string, LimitValue>;
  features: Record<string, boolean | undefined>;
};

export type EntitlementValue =
  | { state: "limit"; limit: number | "unlimited" }
  | { state: "included" }
  | { state: "excluded" }
  | { state: "tbc" };
