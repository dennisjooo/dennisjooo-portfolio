import Image from "next/image";
import { Column } from "@/components/admin/layout/AdminTable";
import type { WorkExperience } from "@/lib/db";
import { createActionsColumn } from "./createActionsColumn";
import { formatRelativeTime } from "@/lib/utils/relativeTime";

export function createWorkExperienceColumns(
  handleDelete: (id: string) => void,
): Column<WorkExperience>[] {
  return [
    {
      header: "Logo",
      cell: (row: WorkExperience) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border/50 bg-muted/30">
          {row.imageSrc && (
            <Image
              src={row.imageSrc}
              alt={row.company}
              fill
              className="object-contain p-1"
              unoptimized={row.imageSrc.startsWith("http")}
            />
          )}
        </div>
      ),
    },
    {
      header: "Position",
      accessorKey: "title",
      sortable: true,
      primary: true,
      cell: (row: WorkExperience) => (
        <div>
          <span className="block font-semibold text-foreground">
            {row.title}
          </span>
          <span className="text-xs text-muted-foreground">{row.company}</span>
        </div>
      ),
    },
    {
      header: "Period",
      accessorKey: "date",
      sortable: true,
      cell: (row: WorkExperience) => (
        <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {row.date}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row: WorkExperience) => (
        <span
          className="text-xs text-muted-foreground"
          title={row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
        >
          {row.createdAt ? formatRelativeTime(row.createdAt) : ""}
        </span>
      ),
    },
    {
      header: "Updated",
      accessorKey: "updatedAt",
      sortable: true,
      cell: (row: WorkExperience) => (
        <span
          className="text-xs text-muted-foreground"
          title={row.updatedAt ? new Date(row.updatedAt).toLocaleString() : ""}
        >
          {row.updatedAt ? formatRelativeTime(row.updatedAt) : ""}
        </span>
      ),
    },
    createActionsColumn<WorkExperience>("/admin/work-experience", handleDelete),
  ];
}
