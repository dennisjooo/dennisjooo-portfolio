import { Column } from "@/components/admin/layout/AdminTable";

export function createMonoBadgeColumn<T extends Record<string, unknown>>(
  accessorKey: keyof T & string,
  header: string,
): Column<T> {
  return {
    header,
    accessorKey,
    sortable: true,
    cell: (row: T) => (
      <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
        {String(row[accessorKey] ?? "")}
      </span>
    ),
  };
}
