import { toast } from "sonner";
import type { PaginationData } from "./adminListTypes";

interface FetchAdminListParams {
  endpoint: string;
  page: number;
  pageSize: number;
  enableReorder: boolean;
  itemName: string;
  searchQuery: string;
  filters: Record<string, string>;
  query?: string;
  currentFilters?: Record<string, string>;
}

interface FetchAdminListResult<T> {
  items: T[];
  pagination?: PaginationData;
}

export async function fetchAdminListItems<T>({
  endpoint,
  page,
  pageSize,
  enableReorder,
  itemName,
  searchQuery,
  filters,
  query,
  currentFilters,
}: FetchAdminListParams): Promise<FetchAdminListResult<T> | null> {
  const params = new URLSearchParams();
  if (!enableReorder) {
    params.set("page", String(page));
    params.set("limit", String(pageSize));
  }
  const q = query ?? searchQuery;
  if (q) params.set("q", q);

  const activeFilters = currentFilters ?? filters;
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const url =
    enableReorder && !params.toString()
      ? endpoint
      : `${endpoint}?${params.toString()}`;

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
    toast.error(errorMessage);
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
