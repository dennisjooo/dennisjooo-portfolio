import Image from "next/image";
import { Column } from "@/components/admin/layout/AdminTable";
import type { WorkExperience } from "@/lib/db";
import { createActionsColumn } from "./createActionsColumn";

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
      cell: (row: WorkExperience) => (
        <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {row.date}
        </span>
      ),
    },
    createActionsColumn<WorkExperience>("/admin/work-experience", handleDelete),
  ];
}
