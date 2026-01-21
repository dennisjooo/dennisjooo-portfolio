"use client";

import { useState } from 'react';
import { IBlog } from '@/models/Blog';
import Image from 'next/image';
import { PhotoIcon, LinkIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

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

  const inputClasses = "w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none";
  const labelClasses = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-border/50 space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <div>
                <label className={labelClasses}>Title</label>
                <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter a catchy title..."
                />
            </div>

            <div>
                <label className={labelClasses}>Slug (Optional)</label>
                <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated-from-title"
                className={`${inputClasses} font-mono text-sm`}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className={labelClasses}>Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={inputClasses}
                >
                    <option value="blog">Blog Post</option>
                    <option value="project">Project</option>
                </select>
                </div>

                <div>
                <label className={labelClasses}>Date</label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClasses}
                />
                </div>
            </div>
             <div>
                <label className={labelClasses}>Description</label>
                <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Short summary for preview cards..."
                />
            </div>
        </div>

        <div className="space-y-6">
             <div>
                <label className={labelClasses}>Cover Image</label>
                <div className="space-y-3">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                        {formData.imageUrl ? (
                        <Image 
                            src={formData.imageUrl} 
                            alt="Cover preview" 
                            fill 
                            className="object-cover"
                            unoptimized={formData.imageUrl.startsWith('http')}
                        />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                                <PhotoIcon className="w-12 h-12 mb-2" />
                                <span className="text-xs uppercase tracking-widest">No Image Selected</span>
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                                <span className="text-white font-medium animate-pulse">Uploading...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="Paste image URL..."
                            className={`${inputClasses} text-xs font-mono`}
                        />
                         <label 
                            className={`flex items-center justify-center px-4 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>
            
             <div>
                <label className={labelClasses}>Related Links</label>
                <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Label (e.g. GitHub)"
                            value={linkInput.text}
                            onChange={e => setLinkInput(prev => ({ ...prev, text: e.target.value }))}
                            className={`${inputClasses} py-2 text-sm`}
                        />
                        <input
                            type="text"
                            placeholder="https://..."
                            value={linkInput.url}
                            onChange={e => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
                            className={`${inputClasses} py-2 text-sm`}
                        />
                        <button
                            type="button"
                            onClick={addLink}
                            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <LinkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                    {formData.links?.map((link, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-background rounded-md border border-border/50 group">
                            <span className="font-medium text-sm">{link.text}</span>
                            <span className="text-xs text-muted-foreground truncate flex-1 font-mono">{link.url}</span>
                            <button
                                type="button"
                                onClick={() => removeLink(index)}
                                className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {(!formData.links || formData.links.length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-2">No links added yet.</p>
                    )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Content (Markdown)</label>
        <div className="relative">
            <textarea
            name="blogPost"
            required
            rows={20}
            value={formData.blogPost}
            onChange={handleChange}
            className={`${inputClasses} font-mono text-sm leading-relaxed resize-y`}
            placeholder="# Write your masterpiece here..."
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border">
                Markdown Supported
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Saving Changes...' : 'Publish Content'}
        </button>
      </div>
    </form>
  );
}
