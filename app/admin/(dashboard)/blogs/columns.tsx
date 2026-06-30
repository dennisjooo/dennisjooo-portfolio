import { Column } from "@/components/admin/AdminTable";
import { AdminActionCell } from "@/components/admin/shared";
import { BLOG_STATUS_STYLES } from "@/lib/constants/blogStatus";
import { formatRelativeTime } from "@/lib/utils/relativeTime";
import type { Blog } from "@/lib/db";

export function createBlogColumns(
  handleDelete: (id: string) => void,
): Column<Blog>[] {
  return [
    {
      header: "Title",
      primary: true,
      cell: (row: Blog) => (
        <span className="font-semibold text-foreground">{row.title}</span>
      ),
    },
    {
      header: "Type",
      cell: (row: Blog) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
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
      cell: (row: Blog) => {
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize w-fit ${BLOG_STATUS_STYLES[row.status] ?? BLOG_STATUS_STYLES.draft}`}
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
    {
      header: "Updated",
      cell: (row: Blog) => (
        <span
          className="text-muted-foreground"
          title={
            row.updatedAt ? new Date(row.updatedAt).toLocaleString() : row.date
          }
        >
          {row.updatedAt ? formatRelativeTime(row.updatedAt) : row.date}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Blog) => (
        <AdminActionCell
          editHref={`/admin/blogs/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];
}
