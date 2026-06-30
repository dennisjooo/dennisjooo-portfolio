"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import {
  AdminPageHeader,
  AdminReorderHint,
  ConfirmDialog,
} from "@/components/admin/shared";
import { useAdminList } from "@/components/admin/hooks";
import type { WorkExperience } from "@/lib/db";
import { createWorkExperienceColumns } from "./columns";

export default function AdminWorkExperienceList() {
  const {
    items,
    loading,
    handleDelete,
    handleReorder,
    deleteDialog,
    confirmDelete,
    cancelDelete,
  } = useAdminList<WorkExperience>({
    endpoint: "/api/work-experience",
    enableReorder: true,
    reorderEndpoint: "/api/work-experience/reorder",
    itemName: "work experience",
    deleteSuccessMessage: "Item deleted successfully",
  });

  const columns = createWorkExperienceColumns(handleDelete);

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
      <AdminReorderHint />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Work Experience"
        description="Are you sure you want to delete this work experience? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
