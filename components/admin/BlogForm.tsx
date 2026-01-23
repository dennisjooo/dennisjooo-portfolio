"use client";

import { useState, useRef, useEffect } from 'react';
import { Blog } from '@/lib/db';
import Image from 'next/image';
import { PhotoIcon, LinkIcon, XMarkIcon, ArrowUpTrayIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { buildUploadPayload } from '@/lib/utils/blobUpload';
import { cn } from '@/lib/utils';
import { formStyles } from './shared/formStyles';
import { FormField } from './shared/FormField';
import { useImageUpload } from '@/lib/hooks/useImageUpload';

interface BlogFormProps {
  initialData?: Blog;
  onSubmit: (data: Partial<Blog>) => Promise<void>;
}

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

export function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>({
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
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { uploading, upload: uploadCoverImage } = useImageUpload({
    onSuccess: (url) => setFormData(prev => ({ ...prev, imageUrl: url })),
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      pendingImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [pendingImages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [formData.blogPost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await uploadCoverImage(e.target.files[0]);
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

  const insertImageToMarkdown = (file: File) => {
    const id = Math.random().toString(36).substring(7);
    const previewUrl = URL.createObjectURL(file);

    setPendingImages(prev => [...prev, { id, file, previewUrl }]);

    const imageMarkdown = `![Image](${previewUrl})`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.blogPost || '';
      const newText = text.substring(0, start) + imageMarkdown + text.substring(end);

      setFormData(prev => ({ ...prev, blogPost: newText }));

      // Restore cursor position (after the inserted image)
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
      }, 0);
    } else {
      setFormData(prev => ({ ...prev, blogPost: (prev.blogPost || '') + '\n' + imageMarkdown }));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) insertImageToMarkdown(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      insertImageToMarkdown(files[0]);
    }
  };

  const handleMarkdownImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      insertImageToMarkdown(e.target.files[0]);
    }
  };

  const processContent = async (content: string) => {
    let processedContent = content;
    const uploadPromises: Promise<void>[] = [];

    // Find all blob URLs in the content
    const blobRegex = /!\[.*?\]\((blob:.*?)\)/g;
    let match;

    // We need to collect matches first to avoid issues with modifying the string while iterating
    const matches: { fullMatch: string, url: string }[] = [];
    while ((match = blobRegex.exec(content)) !== null) {
      matches.push({ fullMatch: match[0], url: match[1] });
    }

    // Filter unique URLs to avoid duplicate uploads
    const uniqueUrls = Array.from(new Set(matches.map(m => m.url)));

    for (const url of uniqueUrls) {
      const pendingImage = pendingImages.find(img => img.previewUrl === url);
      if (pendingImage) {
        const uploadPromise = (async () => {
          try {
            const { contentHash, body } = await buildUploadPayload(pendingImage.file);

            const filename = formData.title 
              ? `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${pendingImage.file.name}`
              : pendingImage.file.name;

            const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}&contentHash=${contentHash}`, {
              method: 'POST',
              body,
            });
            if (!response.ok) throw new Error('Upload failed');
            const blob = await response.json();

            // Replace ALL occurrences of this blob URL in the content
            processedContent = processedContent.split(url).join(blob.url);
          } catch (error) {
            console.error('Failed to upload image:', pendingImage.file.name, error);
            // Optionally handle error (e.g., leave blob URL or show alert)
          }
        })();
        uploadPromises.push(uploadPromise);
      }
    }

    await Promise.all(uploadPromises);
    return processedContent;
  };

  const extractImages = (content: string) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalContent = await processContent(formData.blogPost || '');

      // Handle deletions of removed images
      if (initialData) {
        const initialImages = extractImages(initialData.blogPost || '');
        if (initialData.imageUrl) initialImages.push(initialData.imageUrl);

        const currentImages = extractImages(finalContent);
        if (formData.imageUrl) currentImages.push(formData.imageUrl);

        const imagesToDelete = initialImages.filter(url =>
          !currentImages.includes(url) &&
          url.includes('vercel-storage.com') // Only delete Vercel Blob images
        );

        if (imagesToDelete.length > 0) {
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: imagesToDelete }),
          });
        }
      }

      await onSubmit({ ...formData, blogPost: finalContent });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn(formStyles.panel, "space-y-8 max-w-4xl")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className={formStyles.label}>Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className={formStyles.input}
              placeholder="Enter a catchy title..."
            />
          </div>

          <div>
            <label className={formStyles.label}>Slug (Optional)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug ?? ''}
              onChange={handleChange}
              placeholder="auto-generated-from-title"
              className={`${formStyles.input} font-mono text-sm`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={formStyles.label}>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={formStyles.input}
              >
                <option value="blog">Blog Post</option>
                <option value="project">Project</option>
              </select>
            </div>

            <div>
              <label className={formStyles.label}>Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className={formStyles.input}
              />
            </div>
          </div>
          <div>
            <label className={formStyles.label}>Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={formStyles.input}
              placeholder="Short summary for preview cards..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={formStyles.label}>Cover Image</label>
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Cover preview"
                    fill
                    loading="lazy"
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
                  value={formData.imageUrl ?? ''}
                  onChange={handleChange}
                  placeholder="Paste image URL..."
                  className={`${formStyles.input} text-xs font-mono`}
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
            <label className={formStyles.label}>Related Links</label>
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. GitHub)"
                  value={linkInput.text}
                  onChange={e => setLinkInput(prev => ({ ...prev, text: e.target.value }))}
                  className={`${formStyles.input} py-2 text-sm`}
                />
                <input
                  type="text"
                  placeholder="https://..."
                  value={linkInput.url}
                  onChange={e => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
                  className={`${formStyles.input} py-2 text-sm`}
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
        <div className="flex items-center justify-between mb-2">
          <label className={formStyles.label}>Content (Markdown)</label>
          <label className="flex items-center gap-2 text-xs text-primary cursor-pointer hover:underline">
            <DocumentPlusIcon className="w-4 h-4" />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMarkdownImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            name="blogPost"
            required
            value={formData.blogPost}
            onChange={handleChange}
            onPaste={handlePaste}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`${formStyles.input} font-mono text-sm leading-relaxed resize-none overflow-hidden min-h-[500px] ${dragActive ? 'border-primary ring-2 ring-primary/20' : ''}`}
            placeholder="# Write your masterpiece here... (Drag & drop images supported)"
          />
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border pointer-events-none">
            Markdown Supported • Drag & Drop Images
          </div>
          {dragActive && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] border-2 border-primary border-dashed rounded-lg flex items-center justify-center pointer-events-none">
              <span className="text-primary font-medium">Drop image to insert</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Uploading & Saving...' : 'Publish Content'}
        </button>
      </div>
    </form>
  );
}
