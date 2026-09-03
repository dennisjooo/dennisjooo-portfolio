function normalizeFormValue(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeFormValue);
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      (a, b) => a[0].localeCompare(b[0]),
    );
    const normalized: Record<string, unknown> = {};
    for (const [key, val] of entries) {
      normalized[key] = normalizeFormValue(val);
    }
    return normalized;
  }
  return value;
}

export function serializeFormState(value: unknown): string {
  return JSON.stringify(normalizeFormValue(value));
}
