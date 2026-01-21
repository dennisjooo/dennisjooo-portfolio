"use client";

import { useRouter } from 'next/navigation';
import { BlogForm } from '@/components/admin/BlogForm';
import { IBlog } from '@/models/Blog'; // Ensure this type is exported from where it's defined, or define a local type

export default function NewBlogPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: Partial<IBlog>) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        throw new Error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create blog post');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}
