import type {
  SiteRecord,
  ImportContext,
  ImportFormat,
  ImportLevel,
} from "../types";
import { toCsv } from "./csv";

const SAMPLE_TYPES = ["entry", "exit", "entry"];
const BASE = Date.UTC(2026, 9, 15, 8, 30, 0);

export const buildTemplate = (
  level: ImportLevel,
  format: ImportFormat,
  context: ImportContext,
  site: SiteRecord,
): string => {
  const floors =
    level === "site"
      ? site.floors
      : site.floors.filter((floor) => floor.id === context.floorId);
  const pairs = floors.flatMap((floor) =>
    floor.areas.map((area) => ({ floorId: floor.id, areaId: area.id })),
  );
  const scoped =
    level === "area"
      ? pairs.filter((pair) => pair.areaId === context.areaId)
      : pairs;

  const records = SAMPLE_TYPES.map((type, index) => {
    const pair = scoped[index % Math.max(scoped.length, 1)] ?? {
      floorId: "floor-id",
      areaId: "area-id",
    };
    const timestamp = new Date(BASE + index * 12 * 60_000).toISOString();
    if (level === "site")
      return {
        timestamp,
        type,
        floorId: pair.floorId,
        areaId: pair.areaId,
        siteId: site.id,
      };
    if (level === "floor") return { timestamp, type, areaId: pair.areaId };
    return { timestamp, type };
  });

  if (format === "json") return JSON.stringify(records, null, 2);
  const columns = Object.keys(records[0]);
  return toCsv([
    columns,
    ...records.map((record) =>
      columns.map((column) => record[column as keyof typeof record] ?? ""),
    ),
  ]);
};

export const downloadText = (
  fileName: string,
  text: string,
  format: ImportFormat,
) => {
  const blob = new Blob([text], {
    type: format === "json" ? "application/json" : "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
