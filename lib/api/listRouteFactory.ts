import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { count, SQL } from "drizzle-orm";
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
}

export function createListRouteHandler({
  table,
  entityName,
  orderBy,
  cache = false,
}: ListRouteConfig) {
  async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const { page, limit, offset } = parsePagination(searchParams);

      const orderByClause = Array.isArray(orderBy) ? orderBy : [orderBy];

      const [results, totalResult] = await Promise.all([
        db
          .select()
          .from(table)
          .orderBy(...orderByClause)
          .offset(offset)
          .limit(limit),
        db.select({ count: count() }).from(table),
      ]);

      const total = totalResult[0]?.count ?? 0;
      const response = NextResponse.json({
        success: true,
        data: results,
        pagination: buildPagination(total, page, limit),
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
      const body = await request.json();
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
