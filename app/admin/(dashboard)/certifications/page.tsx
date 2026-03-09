"use client";

import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminActionCell, ConfirmDialog } from '@/components/admin/shared';
import { useAdminList } from '@/components/admin/hooks';
import type { Certification } from '@/lib/db';

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
    endpoint: '/api/certifications',
    pageSize: 10,
    itemName: 'certification',
    deleteSuccessMessage: 'Certification deleted successfully',
  });

  const columns: Column<Certification>[] = [
    {
      header: "Title",
      primary: true,
      cell: (row: Certification) => <span className="font-semibold text-foreground">{row.title}</span>
    },
    {
      header: "Issuer",
      accessorKey: "issuer"
    },
    {
      header: "Year",
      cell: (row: Certification) => <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{row.date}</span>
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Certification) => (
        <AdminActionCell
          editHref={`/admin/certifications/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      )
    }
  ];

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
