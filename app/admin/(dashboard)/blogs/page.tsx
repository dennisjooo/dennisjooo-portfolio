"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminActionCell, ConfirmDialog } from '@/components/admin/shared';
import { useAdminList } from '@/components/admin/hooks';
import { BLOG_STATUS_STYLES } from '@/lib/constants/blogStatus';
import { formatRelativeTime } from '@/lib/utils/relativeTime';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Blog {
  id: string;
  title: string;
  type: string;
  date: string;
  updatedAt: string;
  status: 'draft' | 'scheduled' | 'published';
  publishAt: string | null;
}

export default function AdminBlogsList() {
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkPublishAt, setBulkPublishAt] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const {
    items: blogs,
    loading,
    currentPage,
    totalPages,
    totalItems,
    searchQuery,
    filters,
    selectedIds,
    deleteDialog,
    handlePageChange,
    handleSearch,
    handleFilter,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleBulkDelete,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    refresh,
  } = useAdminList<Blog>({
    endpoint: '/api/blogs',
    pageSize: 10,
    itemName: 'blog',
    deleteSuccessMessage: 'Blog deleted successfully',
  });

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.size === 0) return;
    if (!bulkStatus) {
      toast.error('Select a status to apply');
      return;
    }
    if (bulkStatus === 'scheduled' && !bulkPublishAt) {
      toast.error('Pick a publish date for scheduled posts');
      return;
    }

    setBulkUpdating(true);
    try {
      const payload = bulkStatus === 'scheduled'
        ? { status: bulkStatus, publishAt: bulkPublishAt }
        : { status: bulkStatus, publishAt: null };

      const updatePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/blogs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );

      const results = await Promise.all(updatePromises);
      const successCount = results.filter(r => r.ok).length;

      if (successCount > 0) {
        toast.success(`${successCount} blog${successCount > 1 ? 's' : ''} updated`);
        await refresh(false);
      }
      if (successCount < selectedIds.size) {
        toast.error(`${selectedIds.size - successCount} failed to update`);
      }
    } catch (error) {
      console.error('Bulk status update error:', error);
      toast.error('Something went wrong');
    } finally {
      setBulkUpdating(false);
      setBulkStatus('');
      setBulkPublishAt('');
      clearSelection();
    }
  };

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
          ? 'bg-secondary text-foreground dark:bg-secondary/40 dark:text-foreground'
          : 'bg-accent/20 text-foreground dark:bg-accent/25 dark:text-foreground'
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
      header: "Updated",
      cell: (row: Blog) => (
        <span className="text-muted-foreground" title={row.updatedAt ? new Date(row.updatedAt).toLocaleString() : row.date}>
          {row.updatedAt ? formatRelativeTime(row.updatedAt) : row.date}
        </span>
      )
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

  const deleteDescription = deleteDialog.id
    ? 'Are you sure you want to delete this blog? This action cannot be undone.'
    : `Are you sure you want to delete ${selectedIds.size} blog${selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.`;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editorial"
        titleAccent="Content"
        subtitle={`Manage your digital garden${totalItems ? ` · ${totalItems} items` : ''}`}
        actionHref="/admin/blogs/new"
        actionLabel="Create New"
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilter('type', e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          >
            <option value="">All Types</option>
            <option value="blog">Blog</option>
            <option value="project">Project</option>
          </select>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilter('status', e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg border border-border bg-muted/30 animate-fade-in">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-border bg-background text-xs focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            >
              <option value="">Set status...</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            {bulkStatus === 'scheduled' && (
              <input
                type="datetime-local"
                value={bulkPublishAt}
                onChange={(e) => setBulkPublishAt(e.target.value)}
                className="px-2.5 py-1.5 rounded-md border border-border bg-background text-xs focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              />
            )}
            <button
              type="button"
              onClick={handleBulkStatusUpdate}
              disabled={bulkUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/5 rounded-md transition-colors disabled:opacity-50"
            >
              {bulkUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Delete Selected
          </button>
        </div>
      )}

      <AdminTable
        columns={columns}
        data={blogs}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        enableSelect
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title={deleteDialog.id ? 'Delete Blog' : `Delete ${selectedIds.size} Blog${selectedIds.size > 1 ? 's' : ''}`}
        description={deleteDescription}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
