import type { MetricDefinition, MetricGroupId } from "./types";

export const METRIC_GROUPS: { id: MetricGroupId; label: string }[] = [
  { id: "database", label: "Database" },
  { id: "backend", label: "Backend" },
];

// Rate conventions: counts per 1M, bytes per GB, durations per hour.
export const METRICS: MetricDefinition[] = [
  {
    key: "database.operations",
    group: "database",
    label: "Operations",
    unit: "count",
    rateBasis: "per1M",
    read: (usage) => usage.database.operations,
    finalRate: (rates) => rates.databaseOperationsRate,
  },
  {
    key: "database.aggregations",
    group: "database",
    label: "Aggregations",
    unit: "count",
    rateBasis: "per1M",
    read: (usage) => usage.database.aggregations,
    finalRate: (rates) => rates.databaseOperationsRate,
  },
  {
    key: "database.storageBytes",
    group: "database",
    label: "Storage",
    unit: "bytes",
    rateBasis: "perGB",
    read: (usage) => usage.database.storageBytes,
    finalRate: (rates) => rates.databaseStorageGBRate,
  },
  {
    key: "database.requestBytes",
    group: "database",
    label: "Request data",
    unit: "bytes",
    rateBasis: "perGB",
    read: (usage) => usage.database.requestBytes,
    finalRate: (rates) => rates.databaseRequestGBRate,
  },
  {
    key: "database.responseBytes",
    group: "database",
    label: "Response data",
    unit: "bytes",
    rateBasis: "perGB",
    read: (usage) => usage.database.responseBytes,
    finalRate: (rates) => rates.databaseResponseGBRate,
  },
  {
    key: "backend.requestDuration",
    group: "backend",
    label: "Request processing duration",
    unit: "milliseconds",
    rateBasis: "perHour",
    read: (usage) => usage.backend.requestDuration,
    finalRate: (rates) => rates.backendRequestDurationRate,
  },
  {
    key: "backend.requestBytes",
    group: "backend",
    label: "Request data",
    unit: "bytes",
    rateBasis: "perGB",
    read: (usage) => usage.backend.requestBytes,
    finalRate: (rates) => rates.backendRequestGBRate,
  },
  {
    key: "backend.responseBytes",
    group: "backend",
    label: "Response data",
    unit: "bytes",
    rateBasis: "perGB",
    read: (usage) => usage.backend.responseBytes,
    finalRate: (rates) => rates.backendResponseGBRate,
  },
];
