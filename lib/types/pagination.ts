export interface PaginationResult {
  total: number;
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}
