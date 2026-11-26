import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  primary?: boolean;
  sortable?: boolean;
}
