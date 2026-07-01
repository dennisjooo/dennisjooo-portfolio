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
        <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-muted/30 border border-border/50">
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
          <span className="font-semibold text-foreground block">
            {row.title}
          </span>
          <span className="text-muted-foreground text-xs">{row.company}</span>
        </div>
      ),
    },
    {
      header: "Period",
      cell: (row: WorkExperience) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.date}
        </span>
      ),
    },
    createActionsColumn<WorkExperience>("/admin/work-experience", handleDelete),
  ];
}
