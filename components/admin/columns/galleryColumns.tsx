import Image from "next/image";
import { Column } from "@/components/admin/layout/AdminTable";
import type { GalleryImage } from "@/lib/db";
import { createActionsColumn } from "./createActionsColumn";
import { formatRelativeTime } from "@/lib/utils/relativeTime";

export function createGalleryColumns(
  handleDelete: (id: string) => void,
): Column<GalleryImage>[] {
  return [
    {
      header: "Preview",
      cell: (row: GalleryImage) => (
        <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-border/50 bg-muted/30">
          {row.thumbUrl && (
            <Image
              src={row.thumbUrl}
              alt={row.title}
              fill
              className="object-cover"
              unoptimized={row.thumbUrl.startsWith("http")}
            />
          )}
        </div>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
      sortable: true,
      primary: true,
      cell: (row: GalleryImage) => (
        <div>
          <span className="block font-semibold text-foreground">
            {row.title}
          </span>
          {row.description ? (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {row.description}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      header: "Slug",
      cell: (row: GalleryImage) => (
        <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {row.slug}
        </span>
      ),
    },
    {
      header: "Date Taken",
      accessorKey: "dateTaken" as keyof GalleryImage,
      sortable: true,
      cell: (row: GalleryImage) => {
        const dateTaken = row.exif?.dateTaken;
        if (!dateTaken) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }
        return (
          <span
            className="text-xs text-muted-foreground"
            title={new Date(dateTaken).toLocaleString()}
          >
            {new Date(dateTaken).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row: GalleryImage) => (
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
      cell: (row: GalleryImage) => (
        <span
          className="text-xs text-muted-foreground"
          title={row.updatedAt ? new Date(row.updatedAt).toLocaleString() : ""}
        >
          {row.updatedAt ? formatRelativeTime(row.updatedAt) : ""}
        </span>
      ),
    },
    createActionsColumn<GalleryImage>("/admin/gallery", handleDelete),
  ];
}
