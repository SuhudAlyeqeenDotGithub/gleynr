import { BarChart3, Building2, FileText, Plug, Users } from "lucide-react";
import type { EntitlementGroup } from "./types";

// Structure of the entitlement matrix; plan values live in ./mock.
export const ENTITLEMENT_GROUPS: EntitlementGroup[] = [
  {
    id: "sites",
    label: "Sites",
    icon: Building2,
    items: [{ key: "sites", label: "Sites", kind: "allowance", unit: "sites" }],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    items: [
      {
        key: "internalUsers",
        label: "Internal users",
        kind: "allowance",
        unit: "users",
      },
      {
        key: "externalUsers",
        label: "External users",
        kind: "allowance",
        unit: "users",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    items: [
      {
        key: "monthlyVisits",
        label: "Tracked visits per month",
        kind: "allowance",
        unit: "visits",
      },
      {
        key: "retentionMonths",
        label: "Data retention",
        kind: "allowance",
        unit: "months",
      },
      { key: "visitAnalytics", label: "Visit analytics", kind: "feature" },
      {
        key: "customAnalytics",
        label: "Custom analytics settings",
        kind: "feature",
      },
    ],
  },
  {
    id: "reporting",
    label: "Reporting",
    icon: FileText,
    items: [
      {
        key: "savedReports",
        label: "Saved reports",
        kind: "allowance",
        unit: "reports",
      },
      { key: "dataExport", label: "Data export", kind: "feature" },
      { key: "scheduledReports", label: "Scheduled reports", kind: "feature" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Plug,
    items: [
      { key: "dataImports", label: "Data imports", kind: "feature" },
      { key: "apiAccess", label: "API access", kind: "feature" },
      { key: "sso", label: "Single sign-on (SSO)", kind: "feature" },
    ],
  },
];

export const ENTITLEMENT_ITEMS = ENTITLEMENT_GROUPS.flatMap(
  (group) => group.items,
);
