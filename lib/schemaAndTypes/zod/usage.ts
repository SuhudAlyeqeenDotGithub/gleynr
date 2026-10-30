import { z } from "zod";
import { da } from "zod/locales";


export const usageUnits = ["count", "bytes", "milliseconds"];
export const usageFields = [
  "databaseStorageBytes",
  "databaseRequestBytes",
  "databaseResponseBytes",
  "databaseOperations",
  "backendRequestDuration",
  "backendRequestBytes",
  "backendResponseBytes",
];

export const databaseUsageSchema = z.object({
  operations: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
  aggregations: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
  storageBytes: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
  requestBytes: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
  responseBytes: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
});
export type DatabaseUsage = z.infer<typeof databaseUsageSchema>;

export const backendUsageSchema = z.object({
  requestDuration: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
  requestBytes: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
  responseBytes: z.object({
    unit: z.enum(usageUnits),
    value: z.number(),
    estimateRate: z.number()
  }),
});
export type BackendUsage = z.infer<typeof backendUsageSchema>;

export const usageSchema = z.object({
  id: z.string(),
  organisationId: z.string(),
  billId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  period: z.string(),
  database: databaseUsageSchema,
  backend: backendUsageSchema,
});
export type Usage = z.infer<typeof usageSchema>;

export const currencies = ["USD", "EUR", "GBP"];
export const usageRatesSchema = z.object({
  id: z.string(),
  databaseOperationsRate: z.number(),
  databaseStorageGBRate: z.number(),
  databaseBackupGBRate: z.number(),
  databaseRequestGBRate: z.number(),
  databaseResponseGBRate: z.number(),
  backendRequestDurationRate: z.number(),
  backendRequestGBRate: z.number(),
  backendResponseGBRate: z.number(),
  currency: z.enum(currencies).default("USD"),
  periodStart: z.string(),
  periodEnd: z.string(),
  period: z.string(),
  databaseVatPercentage: z.number(),
  backendVatPercentage: z.number(),
  backendMarginPercentage: z.number(),
  databaseMarginPercentage: z.number(),
});
export type UsageRates = z.infer<typeof usageRatesSchema>;

const organisationUsage = {
  organisationId: "",
  periodStart: "",
  periodEnd: "",

  // Firestore — document operations
  database: {
    hostingProvider: "",
    operations: {
      unit: "count",
      value: 0,
    },

    aggregations: {
      unit: "count",
      value: 0,
    },

    storageBytes: {
      unit: "bytes",
      value: 0,
    },

    requestBytes: {
      unit: "bytes",
      value: 0,
    },
    responseBytes: {
      unit: "bytes",
      value: 0,
    },
  },

  // Python backend — Cloud Run
  backend: {
    hostingProvider: "",
    requestDuration: {
      unit: "milliseconds",
      value: 0,
    },
    requestBytes: {
      unit: "bytes",
      value: 0,
    },
    responseBytes: {
      unit: "bytes",
      value: 0,
    },
  },
};
