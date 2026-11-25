import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, count, SQL, asc, desc } from "drizzle-orm";
import { keysetWhere, parseCursorParams, sliceCursorPage } from "./cursor";
import { withCacheHeaders } from "@/lib/constants/cache";
import {
  requireAuth,
  isAuthError,
  mutationResponse,
  NO_STORE_HEADERS,
  errorResponse,
} from "./apiHelpers";

interface ListRouteConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
  entityName: string;
  orderBy: SQL | SQL[];
  sortableColumns?: string[];
  defaultSort?: { by: string; order: "asc" | "desc" };
  cache?: boolean;
  paginate?: boolean;
  onBeforeInsert?: (
    body: Record<string, unknown>,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;
}

export function createListRouteHandler({
  table,
  entityName,
  orderBy,
  sortableColumns = [],
  defaultSort = { by: "createdAt", order: "desc" },
  cache = false,
  paginate = true,
  onBeforeInsert,
}: ListRouteConfig) {
  async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const { limit, cursor } = parseCursorParams(searchParams);
      const { userId } = await auth();
      const withCache = (response: NextResponse) => {
        if (userId) {
          Object.entries(NO_STORE_HEADERS).forEach(([k, v]) =>
            response.headers.set(k, v),
          );
          return response;
        }
        return cache ? withCacheHeaders(response) : response;
      };

      const sortByParam = searchParams.get("sortBy");
      const sortOrderParam = searchParams.get("sortOrder");
      const validSort =
        sortByParam &&
        sortableColumns.includes(sortByParam) &&
        table[sortByParam]
          ? sortByParam
          : null;
      const sortFn = (dir: "asc" | "desc") => (dir === "asc" ? asc : desc);

      if (paginate) {
        const sortKey = validSort ?? defaultSort.by;
        const dir = validSort
          ? sortOrderParam === "asc"
            ? "asc"
            : "desc"
          : defaultSort.order;
        const fn = sortFn(dir);
        const [rows, totalResult] = await Promise.all([
          db
            .select()
            .from(table)
            .where(and(keysetWhere(table[sortKey], table.id, dir, cursor)))
            .orderBy(fn(table[sortKey]), fn(table.id))
            .limit(limit + 1),
          db.select({ count: count() }).from(table),
        ]);

        const page = sliceCursorPage(rows, limit, sortKey);
        return withCache(
          NextResponse.json({
            success: true,
            data: page.rows,
            pagination: {
              total: totalResult[0]?.count ?? 0,
              limit,
              hasMore: page.hasMore,
              nextCursor: page.nextCursor,
            },
          }),
        );
      }

      const orderByClause = validSort
        ? [sortFn(sortOrderParam === "asc" ? "asc" : "desc")(table[validSort])]
        : Array.isArray(orderBy)
          ? orderBy
          : [orderBy];
      const query = db
        .select()
        .from(table)
        .orderBy(...orderByClause);

      const results = await query;
      const response = NextResponse.json({
        success: true,
        data: results,
      });

      return withCache(response);
    } catch (error) {
      console.error(`Failed to fetch ${entityName}:`, error);
      return errorResponse(`Failed to fetch ${entityName}`);
    }
  }

  async function POST(request: Request) {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    try {
      let body = (await request.json()) as Record<string, unknown>;
      if (onBeforeInsert) {
        body = await onBeforeInsert(body);
      }

      const [item] = (await db
        .insert(table)
        .values(body)
        .returning()) as unknown[];
      return mutationResponse(item, 201);
    } catch (error) {
      console.error(`Failed to create ${entityName}:`, error);
      return errorResponse(`Failed to create ${entityName}`);
    }
  }

  return { GET, POST };
}
