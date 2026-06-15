import { NextResponse } from "next/server";

export const CACHE_CONFIG = {
  MAX_AGE: 60,
  STALE_WHILE_REVALIDATE: 300,
  REVALIDATE: 60,
} as const;

export const CACHE_CONTROL_HEADER = `public, s-maxage=${CACHE_CONFIG.MAX_AGE}, stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE}`;

export function withCacheHeaders<T>(
  response: NextResponse<T>,
): NextResponse<T> {
  response.headers.set("Cache-Control", CACHE_CONTROL_HEADER);
  return response;
}

export function cachedJsonResponse<T>(
  data: T,
  init?: ResponseInit,
): NextResponse<T> {
  const response = NextResponse.json(data, init);
  return withCacheHeaders(response);
}
