import type { PaginationResult } from "@/lib/data/blogs";

export interface PaginationState {
  page: number;
  hasMore: boolean;
  total: number;
}

export interface PrefetchedPage<T> {
  items: T[];
  pagination: PaginationState;
}

export function toPaginationState(data: PaginationResult): PaginationState {
  return {
    page: data.page,
    hasMore: data.hasMore,
    total: data.total,
  };
}

export function buildPaginatedFetchUrl(
  endpoint: string,
  page: number,
  pageSize: number,
  queryParams: Record<string, string | number | boolean>,
): string {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", pageSize.toString());

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  return `${endpoint}?${params.toString()}`;
}

export function parsePaginatedResponse<T>(
  data: Record<string, unknown>,
  resolveData: ((data: Record<string, unknown>) => T[]) | undefined,
  dataKey: string,
  paginationKey: string,
): { items: T[]; pagination: PaginationState | null } {
  const newItems = resolveData
    ? resolveData(data)
    : (data[dataKey] as T[]) || [];
  const paginationData = data[paginationKey] as PaginationResult | undefined;

  return {
    items: newItems,
    pagination: paginationData ? toPaginationState(paginationData) : null,
  };
}
