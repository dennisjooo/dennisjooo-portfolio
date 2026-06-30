"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import { AdminPageHeader, ConfirmDialog } from "@/components/admin/shared";
import { useAdminList } from "@/components/admin/hooks";
import type { Certification } from "@/lib/db";
import { createCertificationColumns } from "./columns";

export default function AdminCertificationsList() {
  const {
    items: certs,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
    deleteDialog,
    confirmDelete,
    cancelDelete,
  } = useAdminList<Certification>({
    endpoint: "/api/certifications",
    pageSize: 10,
    itemName: "certification",
    deleteSuccessMessage: "Certification deleted successfully",
  });

  const columns = createCertificationColumns(handleDelete);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Certifications"
        titleAccent="& Licenses"
        subtitle="Academic and professional milestones"
        actionHref="/admin/certifications/new"
        actionLabel="Add New"
      />

      <AdminTable
        columns={columns}
        data={certs}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Certification"
        description="Are you sure you want to delete this certification? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
