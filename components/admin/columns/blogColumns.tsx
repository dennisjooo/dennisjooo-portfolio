import { Column } from "@/components/admin/layout/AdminTable";
import { BLOG_STATUS_STYLES } from "@/lib/constants/blogStatus";
import type { Blog } from "@/lib/db";
import { createActionsColumn } from "./createActionsColumn";
import { createTimestampColumn } from "./createTimestampColumn";

export function createBlogColumns(
  handleDelete: (id: string) => void,
): Column<Blog>[] {
  return [
    {
      header: "Title",
      accessorKey: "title",
      sortable: true,
      primary: true,
      cell: (row: Blog) => (
        <span className="font-semibold text-foreground">{row.title}</span>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      sortable: true,
      cell: (row: Blog) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            row.type === "project"
              ? "bg-secondary text-foreground dark:bg-secondary/40 dark:text-foreground"
              : "bg-accent/20 text-foreground dark:bg-accent/25 dark:text-foreground"
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row: Blog) => {
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${BLOG_STATUS_STYLES[row.status] ?? BLOG_STATUS_STYLES.draft}`}
            >
              {row.status}
            </span>
            {row.status === "scheduled" && row.publishAt && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(row.publishAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        );
      },
    },
    createTimestampColumn<Blog>("createdAt", "Created"),
    createTimestampColumn<Blog>("updatedAt", "Updated"),
    createActionsColumn<Blog>("/admin/blogs", handleDelete),
  ];
}
