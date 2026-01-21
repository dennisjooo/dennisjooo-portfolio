"use client";

import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminActionCell } from '@/components/admin/shared';
import { useAdminList } from '@/components/admin/hooks';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export default function AdminCertificationsList() {
  const {
    items: certs,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
  } = useAdminList<Certification>({
    endpoint: '/api/certifications',
    pageSize: 10,
    itemName: 'certification',
    deleteConfirmMessage: 'Are you sure you want to delete this certification?',
    deleteSuccessMessage: 'Certification deleted successfully',
  });

  const columns = [
    {
      header: "Title",
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
    </div>
  );
}
