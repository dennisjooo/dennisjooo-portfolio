"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogForm } from '@/components/admin/BlogForm';
import { use } from 'react';
import { IBlog } from '@/models/Blog';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Blog not found');
          router.push('/admin/blogs');
        } else {
          setBlog(data);
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (data: Partial<IBlog>) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        throw new Error('Failed to update blog');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update blog post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <BlogForm initialData={blog} onSubmit={handleSubmit} />
    </div>
  );
}
