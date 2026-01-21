"use client";

import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader } from '@/components/admin/shared';
import { AdminActionCell } from '@/components/admin/shared';
import { useAdminList } from '@/components/admin/hooks';

interface Blog {
  id: string;
  title: string;
  type: string;
  date: string;
}

export default function AdminBlogsList() {
  const {
    items: blogs,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
  } = useAdminList<Blog>({
    endpoint: '/api/blogs',
    pageSize: 10,
    itemName: 'blog',
    deleteConfirmMessage: 'Are you sure you want to delete this blog?',
    deleteSuccessMessage: 'Blog deleted successfully',
  });

  const columns = [
    {
      header: "Title",
      cell: (row: Blog) => <span className="font-semibold text-foreground">{row.title}</span>
    },
    {
      header: "Type",
      cell: (row: Blog) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${row.type === 'project'
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
          {row.type}
        </span>
      )
    },
    {
      header: "Date",
      accessorKey: "date"
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Blog) => (
        <AdminActionCell
          editHref={`/admin/blogs/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      )
    }
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Editorial"
        titleAccent="Content"
        subtitle="Manage your digital garden"
        actionHref="/admin/blogs/new"
        actionLabel="Create New"
      />

      <AdminTable
        columns={columns}
        data={blogs}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
