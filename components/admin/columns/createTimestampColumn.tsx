import { Column } from "@/components/admin/layout/AdminTable";
import { formatRelativeTime } from "@/lib/utils/relativeTime";

type TimestampRow = {
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  date?: string;
};

export function createTimestampColumn<T extends TimestampRow>(
  accessorKey: "createdAt" | "updatedAt",
  header: string,
): Column<T> {
  return {
    header,
    accessorKey,
    sortable: true,
    cell: (row: T) => {
      const value = row[accessorKey];
      const fallback = accessorKey === "updatedAt" ? row.date : undefined;

      return (
        <span
          className="text-xs text-muted-foreground"
          title={value ? new Date(value).toLocaleString() : fallback}
        >
          {value ? formatRelativeTime(value) : (fallback ?? "")}
        </span>
      );
    },
  };
}
