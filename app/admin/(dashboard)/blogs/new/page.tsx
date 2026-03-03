"use client";

import { BlogForm } from '@/components/admin/BlogForm';
import { createAdminNewPage } from '@/components/admin/factories';
import type { Blog } from '@/lib/db';

export default createAdminNewPage<Blog>({
  endpoint: '/api/blogs',
  redirectTo: '/admin/blogs',
  itemName: 'blog',
  FormComponent: BlogForm,
  title: { accent: 'Entry', subtitle: 'Compose a new blog post or project' },
});
