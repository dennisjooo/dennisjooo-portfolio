import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { count, SQL, asc, desc } from "drizzle-orm";
import { withCacheHeaders } from "@/lib/constants/cache";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
  parsePagination,
  buildPagination,
} from "./apiHelpers";

interface ListRouteConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
  entityName: string;
  orderBy: SQL | SQL[];
  cache?: boolean;
  paginate?: boolean;
  defaultOrderBy?: SQL[];
  onBeforeInsert?: (
    body: Record<string, unknown>,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;
}

export function createListRouteHandler({
  table,
  entityName,
  orderBy,
  cache = false,
  paginate = true,
  defaultOrderBy,
  onBeforeInsert,
}: ListRouteConfig) {
  async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const { page, limit, offset } = parsePagination(searchParams);

      const sortByParam = searchParams.get("sortBy");
      const sortOrderParam =
        searchParams.get("sortOrder") === "asc" ? asc : desc;

      let orderByClause =
        defaultOrderBy ?? (Array.isArray(orderBy) ? orderBy : [orderBy]);

      if (sortByParam && table[sortByParam]) {
        orderByClause = [sortOrderParam(table[sortByParam])];
      }

      const query = db
        .select()
        .from(table)
        .orderBy(...orderByClause);

      if (paginate) {
        const [results, totalResult] = await Promise.all([
          query.offset(offset).limit(limit),
          db.select({ count: count() }).from(table),
        ]);

        const total = totalResult[0]?.count ?? 0;
        const response = NextResponse.json({
          success: true,
          data: results,
          pagination: buildPagination(total, page, limit),
        });

        return cache ? withCacheHeaders(response) : response;
      }

      const results = await query;
      const response = NextResponse.json({
        success: true,
        data: results,
      });

      return cache ? withCacheHeaders(response) : response;
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
      return successResponse(item, 201);
    } catch (error) {
      console.error(`Failed to create ${entityName}:`, error);
      return errorResponse(`Failed to create ${entityName}`);
    }
  }

  return { GET, POST };
}
