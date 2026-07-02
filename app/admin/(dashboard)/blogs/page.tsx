"use client";

import { AdminTable } from "@/components/admin/layout/AdminTable";
import { AdminPageHeader, ConfirmDialog } from "@/components/admin/shared";
import { BlogBulkActions } from "@/components/admin/BlogBulkActions";
import { useAdminList } from "@/components/admin/hooks";
import type { Blog } from "@/lib/db";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createBlogColumns } from "@/components/admin/columns";

export default function AdminBlogsList() {
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
    endpoint: "/api/blogs",
    pageSize: 10,
    itemName: "blog",
    deleteSuccessMessage: "Blog deleted successfully",
  });

  const columns = createBlogColumns(handleDelete);

  const deleteDescription = deleteDialog.id
    ? "Are you sure you want to delete this blog? This action cannot be undone."
    : `Are you sure you want to delete ${selectedIds.size} blog${selectedIds.size > 1 ? "s" : ""}? This action cannot be undone.`;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editorial"
        titleAccent="Content"
        subtitle={`Manage your digital garden${totalItems ? ` · ${totalItems} items` : ""}`}
        actionHref="/admin/blogs/new"
        actionLabel="Create New"
      />

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full flex-1 sm:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.type || ""}
            onChange={(e) => handleFilter("type", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-accent/20"
          >
            <option value="">All Types</option>
            <option value="blog">Blog</option>
            <option value="project">Project</option>
          </select>
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilter("status", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-accent/20"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <BlogBulkActions
        selectedIds={selectedIds}
        onBulkDelete={handleBulkDelete}
        onComplete={() => refresh(false)}
        onClearSelection={clearSelection}
      />

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
        title={
          deleteDialog.id
            ? "Delete Blog"
            : `Delete ${selectedIds.size} Blog${selectedIds.size > 1 ? "s" : ""}`
        }
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
