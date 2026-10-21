import { z } from "zod";
import { siteLevelEventSchema } from "@/lib/schemaAndTypes/zod/event";
import type { SiteLevelEvent } from "@/lib/schemaAndTypes/zod/event";
import { IMPORT_LEVELS } from "../constants";
import type {
  ImportContext,
  ImportFormat,
  ImportIssue,
  ImportLevel,
  SiteRecord,
} from "../types";
import { parseCsv } from "./csv";

export type ImportOutcome =
  | { ok: true; events: SiteLevelEvent[] }
  | { ok: false; issues: ImportIssue[] };

type RawRecord = Record<string, unknown>;

const ISO_DATE =
  /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const timestampField = z.unknown().transform((value, ctx) => {
  const date =
    typeof value === "string" && ISO_DATE.test(value.trim())
      ? new Date(value.trim())
      : typeof value === "number"
        ? new Date(value)
        : null;
  if (!date || Number.isNaN(date.getTime())) {
    ctx.addIssue({
      code: "custom",
      message:
        "must be an ISO 8601 date-time, for example 2026-10-01T09:30:00Z.",
    });
    return z.NEVER;
  }
  return date;
});

const textField = (name: string) =>
  z
    .string({ error: `${name} must be text.` })
    .trim()
    .min(1, `${name} is required.`);

const rowSchemaFor = (level: ImportLevel) => {
  const shape: Record<string, z.ZodType> = {
    timestamp: timestampField,
    type: textField("type"),
  };
  if (level !== "area") shape.areaId = textField("areaId");
  if (level === "site") {
    shape.floorId = textField("floorId");
    shape.siteId = textField("siteId").optional();
  }
  return z.object(shape);
};

const isBlank = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

const fileIssue = (message: string): ImportOutcome => ({
  ok: false,
  issues: [{ row: null, message }],
});

const readRecords = (
  text: string,
  format: ImportFormat,
  fields: string[],
): { records: RawRecord[] } | { issues: ImportIssue[] } => {
  if (format === "json") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return {
        issues: [
          {
            row: null,
            message: `The file is not valid JSON (${(error as Error).message}).`,
          },
        ],
      };
    }
    if (!Array.isArray(parsed))
      return {
        issues: [
          { row: null, message: "JSON must be an array of event objects." },
        ],
      };
    const issues: ImportIssue[] = [];
    const records = parsed.map((item, index) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        issues.push({ row: index + 1, message: "Record must be an object." });
        return {};
      }
      return item as RawRecord;
    });
    return issues.length ? { issues } : { records };
  }

  let table: string[][];
  try {
    table = parseCsv(text);
  } catch (error) {
    return { issues: [{ row: null, message: (error as Error).message }] };
  }
  const [header = [], ...body] = table;
  const columns = header.map((cell) => cell.trim());
  const missing = fields.filter((field) => !columns.includes(field));
  if (missing.length)
    return {
      issues: [
        {
          row: null,
          message: `Header row is missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`,
        },
      ],
    };
  const duplicate = columns.find(
    (column, index) => column && columns.indexOf(column) !== index,
  );
  if (duplicate)
    return {
      issues: [
        { row: null, message: `Column "${duplicate}" appears more than once.` },
      ],
    };

  const issues: ImportIssue[] = [];
  const records = body.map((cells, index) => {
    if (cells.length !== columns.length)
      issues.push({
        row: index + 1,
        message: `Expected ${columns.length} values but found ${cells.length}.`,
      });
    return Object.fromEntries(
      columns.map((column, position) => [column, cells[position]]),
    ) as RawRecord;
  });
  return issues.length ? { issues } : { records };
};

type ValidateInput = {
  text: string;
  format: ImportFormat;
  level: ImportLevel;
  context: ImportContext;
  site: SiteRecord;
};

export const validateImport = ({
  text,
  format,
  level,
  context,
  site,
}: ValidateInput): ImportOutcome => {
  if (!text.trim()) return fileIssue("The file is empty.");

  const floorById = new Map(site.floors.map((floor) => [floor.id, floor]));
  const contextFloor = context.floorId
    ? floorById.get(context.floorId)
    : undefined;
  const contextArea = contextFloor?.areas.find(
    (area) => area.id === context.areaId,
  );
  if (level !== "site" && !contextFloor)
    return fileIssue("Select a floor before uploading a file.");
  if (level === "area" && !contextArea)
    return fileIssue("Select an area before uploading a file.");

  const spec = IMPORT_LEVELS.find((item) => item.value === level)!;
  const read = readRecords(text, format, spec.required);
  if ("issues" in read) return { ok: false, issues: read.issues };
  if (!read.records.length)
    return fileIssue("The file contains a header but no event rows.");

  const schema = rowSchemaFor(level);
  const issues: ImportIssue[] = [];
  const events: SiteLevelEvent[] = [];

  read.records.forEach((record, index) => {
    const row = index + 1;
    const before = issues.length;

    spec.required.forEach((field) => {
      if (isBlank(record[field]))
        issues.push({ row, field, message: `${field} is required.` });
    });
    if (issues.length > before) return;

    const parsed = schema.safeParse({
      ...record,
      siteId: isBlank(record.siteId) ? undefined : record.siteId,
    });
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = String(issue.path[0] ?? "");
        issues.push({
          row,
          field,
          message: issue.message.startsWith(field)
            ? issue.message
            : `${field} ${issue.message}`,
        });
      });
      return;
    }

    const values = parsed.data as {
      timestamp: Date;
      type: string;
      floorId?: string;
      areaId?: string;
      siteId?: string;
    };

    if (values.siteId && values.siteId !== site.id)
      issues.push({
        row,
        field: "siteId",
        message: `siteId "${values.siteId}" does not match this site (${site.id}).`,
      });

    const floorId = level === "site" ? values.floorId! : context.floorId!;
    const floor = floorById.get(floorId);
    if (!floor) {
      issues.push({
        row,
        field: "floorId",
        message: `Unknown floorId "${floorId}".`,
      });
      return;
    }
    const areaId = level === "area" ? context.areaId! : values.areaId!;
    if (!floor.areas.some((area) => area.id === areaId)) {
      const exists = site.floors.some((item) =>
        item.areas.some((area) => area.id === areaId),
      );
      issues.push({
        row,
        field: "areaId",
        message: exists
          ? `areaId "${areaId}" does not belong to floor "${floor.id}".`
          : `Unknown areaId "${areaId}".`,
      });
      return;
    }
    if (issues.length > before) return;

    const event = siteLevelEventSchema.safeParse({
      timestamp: values.timestamp,
      type: values.type,
      areaId,
      floorId,
      siteId: site.id,
    });
    if (event.success) events.push(event.data);
    else issues.push({ row, message: "Row could not be normalised." });
  });

  return issues.length ? { ok: false, issues } : { ok: true, events };
};
