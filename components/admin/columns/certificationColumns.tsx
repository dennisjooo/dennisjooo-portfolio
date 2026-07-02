import { Column } from "@/components/admin/layout/AdminTable";
import type { Certification } from "@/lib/db";
import { createActionsColumn } from "./createActionsColumn";

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
        <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {row.date}
        </span>
      ),
    },
    createActionsColumn<Certification>("/admin/certifications", handleDelete),
  ];
}
