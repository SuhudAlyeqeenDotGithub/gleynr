import type { Site } from "@/lib/schemaAndTypes/zod/site";

export type SiteStatus = "Active" | "Paused";

export type Coordinates = { lat: number; lng: number };

export type SiteRecord = Site & {
  location: string;
  coordinates: Coordinates;
  status: SiteStatus;
};

export type LocationPreset = {
  label: string;
  coordinates: Coordinates;
};

export type TokenTransaction = {
  id: string;
  reference: string;
  quantity: number;
  pricePerToken: number;
  total: number;
  purchasedAt: Date;
};

export type TokenSummary = {
  purchased: number;
  used: number;
  available: number;
};

export type ImportLevel = "site" | "floor" | "area";
export type ImportFormat = "csv" | "json";

export type ImportContext = {
  siteId: string;
  floorId?: string;
  areaId?: string;
};

export type ImportIssue = {
  /** 1-based data row (header excluded); null for file-level problems. */
  row: number | null;
  field?: string;
  message: string;
};

export type ImportRecord = {
  id: string;
  siteId: string;
  level: ImportLevel;
  format: ImportFormat;
  fileName: string;
  rows: number;
  target: string;
  importedAt: Date;
};

export type SiteFormErrors = Partial<Record<"name" | "location", string>>;
