import {
  Activity,
  Calculator,
  CircleArrowDown,
  CircleArrowUp,
  CircleCheck,
  CircleMinus,
  CircleX,
  Clock,
  Hourglass,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Tone =
  | "success"
  | "brand"
  | "danger"
  | "warning"
  | "neutral"
  | "info";

export type StatusPreset = { tone: Tone; icon: LucideIcon };

export const SUBSCRIPTION_STATUS: Record<string, StatusPreset> = {
  Active: { tone: "success", icon: CircleCheck },
  Upgraded: { tone: "brand", icon: CircleArrowUp },
  Downgraded: { tone: "warning", icon: CircleArrowDown },
  Cancelled: { tone: "danger", icon: CircleX },
  Expired: { tone: "neutral", icon: Clock },
};

export const BILLING_STATUS: Record<string, StatusPreset> = {
  "In Progress": { tone: "brand", icon: Activity },
  "Awaiting Calculation": { tone: "warning", icon: Hourglass },
  Calculated: { tone: "info", icon: Calculator },
  Charged: { tone: "success", icon: CircleCheck },
  "Not Charged": { tone: "neutral", icon: CircleMinus },
};

export const INVOICE_STATUS: Record<string, StatusPreset> = {
  Paid: { tone: "success", icon: CircleCheck },
  Pending: { tone: "brand", icon: Clock },
  Failed: { tone: "danger", icon: CircleX },
  "Action Required": { tone: "warning", icon: TriangleAlert },
  "Not Charged": { tone: "neutral", icon: CircleMinus },
};

export const ATTEMPT_OUTCOME: Record<string, StatusPreset> = {
  Succeeded: INVOICE_STATUS.Paid,
  Processing: INVOICE_STATUS.Pending,
  Failed: INVOICE_STATUS.Failed,
  "Action Required": INVOICE_STATUS["Action Required"],
};
