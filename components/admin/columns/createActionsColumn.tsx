import { Column } from "@/components/admin/layout/AdminTable";
import { AdminActionCell } from "@/components/admin/shared";

export function createActionsColumn<T extends { id: string }>(
  entityPath: string,
  handleDelete: (id: string) => void,
): Column<T> {
  return {
    header: "Actions",
    className: "text-right",
    cell: (row: T) => (
      <AdminActionCell
        editHref={`${entityPath}/${row.id}`}
        onDelete={() => handleDelete(row.id)}
      />
    ),
  };
}
