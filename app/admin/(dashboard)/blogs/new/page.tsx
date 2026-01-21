"use client";

import { useRouter } from 'next/navigation';
import { BlogForm } from '@/components/admin/BlogForm';
import { Blog } from '@/lib/db'; 
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewBlogPage() {
  const router = useRouter();
  
  const handleSubmit = async (data: Partial<Blog>) => {
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
                    New <span className="not-italic font-sans">Entry</span>
                </h1>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    Compose a new blog post or project
                </p>
             </div>
        </div>

      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}
