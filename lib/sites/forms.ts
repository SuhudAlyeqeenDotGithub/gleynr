import type { ZodType } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Returns parsed values, or per-field messages from the first issue of each field.
export const validateForm = <T>(
  schema: ZodType<T>,
  input: unknown,
): { ok: true; values: T } | { ok: false; errors: FieldErrors<T> } => {
  const result = schema.safeParse(input);
  if (result.success) return { ok: true, values: result.data };
  const errors: FieldErrors<T> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof T;
    if (key !== undefined && !errors[key]) errors[key] = issue.message;
  });
  return { ok: false, errors };
};
