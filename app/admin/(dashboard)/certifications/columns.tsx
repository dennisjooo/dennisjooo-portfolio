import { Column } from "@/components/admin/AdminTable";
import { AdminActionCell } from "@/components/admin/shared";
import type { Certification } from "@/lib/db";

export function createCertificationColumns(
  handleDelete: (id: string) => void,
): Column<Certification>[] {
  return [
    {
      header: "Title",
      primary: true,
      cell: (row: Certification) => (
        <span className="font-semibold text-foreground">{row.title}</span>
      ),
    },
    {
      header: "Issuer",
      accessorKey: "issuer",
    },
    {
      header: "Year",
      cell: (row: Certification) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.date}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Certification) => (
        <AdminActionCell
          editHref={`/admin/certifications/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];
}
