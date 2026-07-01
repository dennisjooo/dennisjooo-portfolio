export interface UseAdminListOptions {
  endpoint: string;
  pageSize?: number;
  enableReorder?: boolean;
  reorderEndpoint?: string;
  deleteSuccessMessage?: string;
  itemName?: string;
}

export interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
}

export interface DeleteDialogState {
  open: boolean;
  id: string | null;
  loading: boolean;
}

export interface UseAdminListReturn<T> {
  items: T[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  searchQuery: string;
  filters: Record<string, string>;
  selectedIds: Set<string>;
  deleteDialog: DeleteDialogState;
  handlePageChange: (page: number) => void;
  handleSearch: (query: string) => void;
  handleFilter: (key: string, value: string) => void;
  handleDelete: (id: string) => void;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;
  handleBulkDelete: () => void;
  confirmBulkDelete: () => Promise<void>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  handleReorder: (nextItems: T[]) => Promise<void>;
  refresh: (showLoading?: boolean) => Promise<void>;
}
