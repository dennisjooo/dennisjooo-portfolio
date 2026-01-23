"use client";

import Image from "next/image";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader, AdminActionCell } from "@/components/admin/shared";
import { useAdminList } from "@/components/admin/hooks";

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  date: string;
  imageSrc: string;
  order: number;
}

export default function AdminWorkExperienceList() {
  const {
    items,
    loading,
    handleDelete,
    handleReorder,
  } = useAdminList<WorkExperience>({
    endpoint: "/api/work-experience",
    enableReorder: true,
    reorderEndpoint: "/api/work-experience/reorder",
    itemName: "work experience",
    deleteConfirmMessage: "Are you sure you want to delete this work experience?",
    deleteSuccessMessage: "Item deleted successfully",
  });

  const columns: Column<WorkExperience>[] = [
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
    {
      header: "Actions",
      className: "text-right",
      cell: (row: WorkExperience) => (
        <AdminActionCell
          editHref={`/admin/work-experience/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Work"
        titleAccent="Experience"
        subtitle="Career timeline and education"
        actionHref="/admin/work-experience/new"
        actionLabel="Add New"
      />

      <AdminTable
        columns={columns}
        data={items}
        isLoading={loading}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        enableReorder
        onReorder={handleReorder}
      />
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Drag the grip in the Order column to reorder. Lower numbers appear first.
      </p>
    </div>
  );
}
