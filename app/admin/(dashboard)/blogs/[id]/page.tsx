"use client";

import { use } from 'react';
import { BlogForm } from '@/components/admin/BlogForm';
import { AdminFormLayout, LoadingSpinner } from '@/components/admin/shared';
import { useAdminForm } from '@/components/admin/hooks';
import { Blog } from '@/lib/db';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: blog, loading, handleSubmit } = useAdminForm<Blog>({
    endpoint: '/api/blogs',
    id,
    redirectTo: '/admin/blogs',
    itemName: 'blog',
  });

  if (loading) return <LoadingSpinner />;
  if (!blog) return null;

  return (
    <AdminFormLayout
      title="Edit"
      titleAccent="Content"
      subtitle="Refine your masterpiece"
    >
      <BlogForm initialData={blog} onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}
