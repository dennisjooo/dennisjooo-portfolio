"use client";

import { BlogForm } from '@/components/admin/BlogForm';
import { createAdminEditPage } from '@/components/admin/factories';
import type { Blog } from '@/lib/db';

export default createAdminEditPage<Blog>({
  endpoint: '/api/blogs',
  redirectTo: '/admin/blogs',
  itemName: 'blog',
  FormComponent: BlogForm,
  title: { accent: 'Content', subtitle: 'Refine your masterpiece' },
});
