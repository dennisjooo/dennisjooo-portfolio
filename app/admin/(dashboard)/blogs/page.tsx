"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminTable } from '@/components/admin/AdminTable';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface Blog {
  id: string;
  title: string;
  type: string;
  date: string;
}

export default function AdminBlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchBlogs = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?page=${page}&limit=${pageSize}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.data) {
        setBlogs(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchBlogs(1);
  }, [fetchBlogs]);

  const handlePageChange = (page: number) => {
    fetchBlogs(page);
  };

  const deleteBlog = async (id: string) => {
    toast("Are you sure you want to delete this blog?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await fetch(`/api/blogs/${id}`, {
              method: 'DELETE',
            });

            if (res.ok) {
              fetchBlogs(currentPage); // Refresh list
              toast.success('Blog deleted successfully');
            } else {
              toast.error('Failed to delete');
            }
          } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Something went wrong');
          }
        }
      },
    });
  };

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
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/blogs/${row.id}`}
            className="p-2 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
            title="Edit"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => deleteBlog(row.id)}
            className="p-2 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair italic text-3xl md:text-4xl text-foreground">
            Editorial <span className="not-italic font-sans font-bold">Content</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Manage your digital garden
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-urbanist font-medium shadow-lg shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          Create New
        </Link>
      </div>

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
