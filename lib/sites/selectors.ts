import type { Site as DashboardSite } from "@/lib/dashboard/types";
import type { SiteRecord, TokenSummary, TokenTransaction } from "./types";

export const countAreas = (site: SiteRecord) =>
  site.floors.reduce((sum, floor) => sum + floor.areas.length, 0);

export const countEvents = (site: SiteRecord) =>
  site.floors.reduce(
    (sum, floor) =>
      sum + floor.areas.reduce((inner, area) => inner + area.events.length, 0),
    0,
  );

// Used tokens always equal the number of created sites, so the counts cannot drift.
export const summariseTokens = (
  transactions: TokenTransaction[],
  sites: SiteRecord[],
): TokenSummary => {
  const purchased = transactions.reduce((sum, item) => sum + item.quantity, 0);
  const used = sites.length;
  return { purchased, used, available: Math.max(purchased - used, 0) };
};

export const toDashboardSites = (sites: SiteRecord[]): DashboardSite[] =>
  sites.map((site, index) => ({
    id: index + 1,
    name: site.name,
    location: site.location,
    status: site.status,
    visits: site.floors.reduce(
      (sum, floor) =>
        sum +
        floor.areas.reduce(
          (inner, area) =>
            inner +
            area.events.filter((event) => event.type === "entry").length,
          0,
        ),
      0,
    ),
    floors: site.floors.length,
  }));

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);

export const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
