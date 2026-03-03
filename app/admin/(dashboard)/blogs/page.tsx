"use client";

import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminActionCell } from '@/components/admin/shared';
import { useAdminList } from '@/components/admin/hooks';
import { BLOG_STATUS_STYLES } from '@/lib/constants/blogStatus';

interface Blog {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'draft' | 'scheduled' | 'published';
  publishAt: string | null;
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

  const columns: Column<Blog>[] = [
    {
      header: "Title",
      primary: true,
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
      header: "Status",
      cell: (row: Blog) => {
        return (
          <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize w-fit ${BLOG_STATUS_STYLES[row.status] ?? BLOG_STATUS_STYLES.draft}`}>
              {row.status}
            </span>
            {row.status === 'scheduled' && row.publishAt && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(row.publishAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        );
      }
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
