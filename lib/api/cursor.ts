import { sql, type AnyColumn, type SQL } from "drizzle-orm";

interface Cursor {
  v: string | number;
  id: string;
}

export function parseCursorParams(searchParams: URLSearchParams) {
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10") || 10, 1),
    100,
  );
  return { limit, cursor: searchParams.get("cursor") };
}

function encodeCursor(row: Record<string, unknown>, sortKey: string) {
  const raw = row[sortKey];
  const v = raw instanceof Date ? raw.toISOString() : (raw as string | number);
  return Buffer.from(JSON.stringify({ v, id: row.id })).toString("base64url");
}

function decodeCursor(cursor: string): Cursor | null {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString());
    return typeof parsed?.id === "string" && parsed.v != null ? parsed : null;
  } catch {
    return null;
  }
}

/** Rows strictly after `cursor` for `ORDER BY sortCol dir, id dir`. */
export function keysetWhere(
  sortCol: AnyColumn,
  idCol: AnyColumn,
  dir: "asc" | "desc",
  cursor: string | null,
): SQL | undefined {
  const decoded = cursor ? decodeCursor(cursor) : null;
  if (!decoded) return undefined;
  const op = dir === "asc" ? sql.raw(">") : sql.raw("<");
  return sql`(${sortCol}, ${idCol}) ${op} (${decoded.v}, ${decoded.id})`;
}

/** Expects rows fetched with `limit + 1`. */
export function sliceCursorPage<T extends Record<string, unknown>>(
  rows: T[],
  limit: number,
  sortKey: string,
) {
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];
  return {
    rows: page,
    hasMore,
    nextCursor: hasMore && last ? encodeCursor(last, sortKey) : null,
  };
}
