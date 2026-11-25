import { siteToast } from "@/lib/ui/siteToast";
import { buildPaginatedFetchUrl } from "@/lib/hooks/data/paginatedListUtils";
import type { PaginationData } from "./adminListTypes";

interface FetchAdminListParams {
  endpoint: string;
  cursor: string | null;
  pageSize: number;
  enableReorder: boolean;
  itemName: string;
  searchQuery: string;
  filters: Record<string, string>;
  query?: string;
  currentFilters?: Record<string, string>;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
}

interface FetchAdminListResult<T> {
  items: T[];
  pagination?: PaginationData;
}

export async function fetchAdminListItems<T>({
  endpoint,
  cursor,
  pageSize,
  enableReorder,
  itemName,
  searchQuery,
  filters,
  query,
  currentFilters,
  sortBy,
  sortOrder,
}: FetchAdminListParams): Promise<FetchAdminListResult<T> | null> {
  const q = query ?? searchQuery;
  const activeFilters = currentFilters ?? filters;
  const extra: Record<string, string | number | boolean> = {};
  if (q) extra.q = q;
  if (sortBy) extra.sortBy = sortBy;
  if (sortOrder) extra.sortOrder = sortOrder;
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value) extra[key] = value;
  });

  const url = enableReorder
    ? Object.keys(extra).length
      ? `${endpoint}?${new URLSearchParams(Object.entries(extra).map(([k, v]) => [k, String(v)]))}`
      : endpoint
    : buildPaginatedFetchUrl(endpoint, cursor, pageSize, extra);

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    let errorMessage = `Failed to fetch ${itemName}s`;
    try {
      const errorData = await res.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = `Failed to fetch ${itemName}s: ${res.status} ${res.statusText}`;
    }
    siteToast.error(errorMessage);
    return null;
  }

  const data = await res.json();

  if (data.success === false || !(data.data || Array.isArray(data))) {
    return null;
  }

  const items = (data.data || data) as T[];
  return {
    items,
    pagination: data.pagination as PaginationData | undefined,
  };
}
