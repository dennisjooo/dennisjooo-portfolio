"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogForm } from '@/components/admin/BlogForm';
import { use } from 'react';
import { Blog } from '@/lib/db';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
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

  const handleSubmit = async (data: Partial<Blog>) => {
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

  if (loading) return (
    <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!blog) return null;

  return (
    <div className="space-y-8">
         <div className="flex items-center gap-4">
             <button
                type="button"
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
            </button>
             <div>
                <h1 className="font-playfair italic text-3xl font-bold text-foreground">
                    Edit <span className="not-italic font-sans">Content</span>
                </h1>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    Refine your masterpiece
                </p>
             </div>
        </div>
      <BlogForm initialData={blog} onSubmit={handleSubmit} />
    </div>
  );
}
