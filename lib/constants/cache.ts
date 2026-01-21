import { NextResponse } from "next/server";

/**
 * Cache configuration constants
 * Used for both API route headers and unstable_cache revalidation
 */
export const CACHE_CONFIG = {
  /** Time in seconds before cache is considered stale (1 minute) */
  MAX_AGE: 60,
  /** Time in seconds to serve stale content while revalidating (5 minutes) */
  STALE_WHILE_REVALIDATE: 300,
  /** Revalidation time for unstable_cache (1 minute) */
  REVALIDATE: 60,
} as const;

/**
 * Cache-Control header value for API routes
 */
export const CACHE_CONTROL_HEADER = `public, s-maxage=${CACHE_CONFIG.MAX_AGE}, stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE}`;

/**
 * Applies cache headers to a NextResponse for public GET requests
 */
export function withCacheHeaders<T>(response: NextResponse<T>): NextResponse<T> {
  response.headers.set("Cache-Control", CACHE_CONTROL_HEADER);
  return response;
}

/**
 * Creates a cached JSON response with proper headers
 */
export function cachedJsonResponse<T>(data: T, init?: ResponseInit): NextResponse<T> {
  const response = NextResponse.json(data, init);
  return withCacheHeaders(response);
}
