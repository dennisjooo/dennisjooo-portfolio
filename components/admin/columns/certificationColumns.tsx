import { Column } from "@/components/admin/layout/AdminTable";
import type { Certification } from "@/lib/db";
import { createActionsColumn } from "./createActionsColumn";
import { createMonoBadgeColumn } from "./createMonoBadgeColumn";

export function createCertificationColumns(
  handleDelete: (id: string) => void,
): Column<Certification>[] {
  return [
    {
      header: "Title",
      accessorKey: "title",
      sortable: true,
      primary: true,
      cell: (row: Certification) => (
        <span className="font-semibold text-foreground">{row.title}</span>
      ),
    },
    {
      header: "Issuer",
      accessorKey: "issuer",
      sortable: true,
    },
    createMonoBadgeColumn<Certification>("date", "Year"),
    createActionsColumn<Certification>("/admin/certifications", handleDelete),
  ];
}
