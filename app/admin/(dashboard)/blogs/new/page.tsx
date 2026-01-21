"use client";

import { BlogForm } from '@/components/admin/BlogForm';
import { AdminFormLayout } from '@/components/admin/shared';
import { useAdminForm } from '@/components/admin/hooks';
import { Blog } from '@/lib/db';

export default function NewBlogPage() {
  const { handleSubmit } = useAdminForm<Blog>({
    endpoint: '/api/blogs',
    redirectTo: '/admin/blogs',
    itemName: 'blog',
  });

  return (
    <AdminFormLayout
      title="New"
      titleAccent="Entry"
      subtitle="Compose a new blog post or project"
    >
      <BlogForm onSubmit={handleSubmit} />
    </AdminFormLayout>
  );
}
