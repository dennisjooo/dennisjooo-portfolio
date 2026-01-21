"use client";

import { useState } from 'react';
import { IBlog } from '@/models/Blog';
import Image from 'next/image';

interface BlogFormProps {
  initialData?: IBlog;
  onSubmit: (data: Partial<IBlog>) => Promise<void>;
}

export function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<IBlog>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'blog',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    imageUrl: initialData?.imageUrl || '',
    blogPost: initialData?.blogPost || '',
    links: initialData?.links || [],
    slug: initialData?.slug || '',
  });

  const [linkInput, setLinkInput] = useState({ text: '', url: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');

      const newBlob = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: newBlob.url }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    if (linkInput.text && linkInput.url) {
      setFormData(prev => ({
        ...prev,
        links: [...(prev.links || []), linkInput]
      }));
      setLinkInput({ text: '', url: '' });
    }
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug (Optional)</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Leave empty to auto-generate from title"
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="blog">Blog</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image</label>
        
        {formData.imageUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-2">
            <Image 
              src={formData.imageUrl} 
              alt="Cover preview" 
              fill 
              className="object-cover"
              unoptimized={formData.imageUrl.startsWith('http')}
            />
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL or upload new"
            className="flex-1 p-2 border rounded-md bg-background"
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="cover-upload"
          />
          <label 
            htmlFor="cover-upload"
            className={`px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80 flex items-center ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? '...' : 'Upload'}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content (Markdown)</label>
        <textarea
          name="blogPost"
          required
          rows={15}
          value={formData.blogPost}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Links</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Text"
            value={linkInput.text}
            onChange={e => setLinkInput(prev => ({ ...prev, text: e.target.value }))}
            className="flex-1 p-2 border rounded-md bg-background"
          />
          <input
            type="text"
            placeholder="URL"
            value={linkInput.url}
            onChange={e => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
            className="flex-1 p-2 border rounded-md bg-background"
          />
          <button
            type="button"
            onClick={addLink}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.links?.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="font-medium">{link.text}:</span>
              <span className="text-sm text-muted-foreground truncate flex-1">{link.url}</span>
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}
