"use client";

import { useState, useRef, useEffect } from 'react';
import { Blog } from '@/lib/db';
import { EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { buildUploadPayload } from '@/lib/utils/blobUpload';
import { cn } from '@/lib/utils';
import { formStyles } from './shared/formStyles';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { useFormDirty } from './hooks/useUnsavedChanges';
import { BlogFormFields } from './BlogFormFields';
import { LinkManager } from './LinkManager';
import { MarkdownEditor, EditorMode } from './MarkdownEditor';

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
    status: initialData?.status || 'draft',
    publishAt: initialData?.publishAt || null,
  });

  const [editorMode, setEditorMode] = useState<EditorMode>('write');
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useFormDirty(formData);

  const effectiveSlug = formData.slug || createUrlSlug(formData.title || '');
  const canUploadImages = Boolean(effectiveSlug);
  const imageFolder = effectiveSlug ? `blog/${effectiveSlug}` : undefined;

  const { uploading, upload: uploadCoverImage } = useImageUpload({
    folder: imageFolder,
    onSuccess: (url) => setFormData(prev => ({ ...prev, imageUrl: url })),
  });

  useEffect(() => {
    return () => {
      pendingImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [pendingImages]);

  // Clean up any leftover preview entry for this slug on mount
  useEffect(() => {
    if (!effectiveSlug) return;
    const previewSlug = `${effectiveSlug}-preview`;
    fetch('/api/blogs/preview', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: previewSlug }),
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    if (editorMode === 'split') return;
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [formData.blogPost, editorMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await uploadCoverImage(e.target.files[0]);
  };

  const addLink = (link: { text: string; url: string }) => {
    setFormData(prev => ({
      ...prev,
      links: [...(prev.links || []), link]
    }));
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

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
      }, 0);
    } else {
      setFormData(prev => ({ ...prev, blogPost: (prev.blogPost || '') + '\n' + imageMarkdown }));
    }
  };

  const processContent = async (content: string) => {
    let processedContent = content;
    const uploadPromises: Promise<void>[] = [];

    const blobRegex = /!\[.*?\]\((blob:.*?)\)/g;
    let match;

    const matches: { fullMatch: string, url: string }[] = [];
    while ((match = blobRegex.exec(content)) !== null) {
      matches.push({ fullMatch: match[0], url: match[1] });
    }

    const uniqueUrls = Array.from(new Set(matches.map(m => m.url)));

    for (const url of uniqueUrls) {
      const cleanBlobUrl = url.replace(/\s+=\d*x\d*$/, '').replace(/#dim=\d*x\d*$/, '');
      const pendingImage = pendingImages.find(img => img.previewUrl === cleanBlobUrl);
      if (pendingImage) {
        const uploadPromise = (async () => {
          try {
            const { contentHash, body } = await buildUploadPayload(pendingImage.file);

            const filename = formData.title
              ? `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${pendingImage.file.name}`
              : pendingImage.file.name;

            const slug = formData.slug || createUrlSlug(formData.title || '');
            const folder = slug ? `blog/${slug}` : undefined;
            const params = new URLSearchParams({ filename, contentHash });
            if (folder) params.set('folder', folder);

            const response = await fetch(`/api/upload?${params.toString()}`, {
              method: 'POST',
              body,
            });
            if (!response.ok) throw new Error('Upload failed');
            const blob = await response.json();

            const dimInfo = url.match(/\s+=(\d*x\d*)$/) || url.match(/#dim=(\d*x\d*)$/);
            const uploadedUrl = dimInfo ? `${blob.url}#dim=${dimInfo[1]}` : blob.url;

            processedContent = processedContent.split(url).join(uploadedUrl);
          } catch (error) {
            console.error('Failed to upload image:', pendingImage.file.name, error);
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
      const cleanUrl = match[1].replace(/#dim=\d*x\d*$/, '').replace(/\s+=\d*x\d*$/, '');
      matches.push(cleanUrl);
    }
    return matches;
  };

  const [previewing, setPreviewing] = useState(false);

  const handlePreview = async () => {
    if (!formData.title) {
      toast.error('Add a title before previewing');
      return;
    }

    setPreviewing(true);
    try {
      const previewContent = await processContent(formData.blogPost || '');
      const response = await fetch('/api/blogs/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, blogPost: previewContent }),
      });

      if (!response.ok) throw new Error('Failed to create preview');
      const { data } = await response.json();
      window.open(`/blogs/${data.slug}?preview=true`, '_blank');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create preview');
    } finally {
      setPreviewing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalContent = await processContent(formData.blogPost || '');

      if (initialData) {
        const initialImages = extractImages(initialData.blogPost || '');
        if (initialData.imageUrl) initialImages.push(initialData.imageUrl);

        const currentImages = extractImages(finalContent);
        if (formData.imageUrl) currentImages.push(formData.imageUrl);

        const imagesToDelete = initialImages.filter(url =>
          !currentImages.includes(url) &&
          url.includes('vercel-storage.com')
        );

        if (imagesToDelete.length > 0) {
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: imagesToDelete }),
          });
        }
      }

      const submitData = { ...formData, blogPost: finalContent };
      if (submitData.status !== 'scheduled') {
        submitData.publishAt = null;
      }
      await onSubmit(submitData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn(formStyles.panel, "space-y-8", editorMode === 'split' ? "max-w-7xl" : "max-w-4xl")}>
      <BlogFormFields
        formData={formData}
        onChange={handleChange}
        onFormDataChange={setFormData}
        uploading={uploading}
        canUploadImages={canUploadImages}
        onCoverImageUpload={handleCoverImageUpload}
      />

      <LinkManager
        links={formData.links || []}
        onAdd={addLink}
        onRemove={removeLink}
      />

      <MarkdownEditor
        content={formData.blogPost || ''}
        onChange={handleChange}
        onContentChange={(content) => setFormData(prev => ({ ...prev, blogPost: content }))}
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        canUploadImages={canUploadImages}
        onInsertImage={insertImageToMarkdown}
        textareaRef={textareaRef}
      />

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <button
          type="button"
          onClick={handlePreview}
          disabled={previewing || !formData.title}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <EyeIcon className="w-4 h-4" />
          {previewing ? 'Creating Preview...' : 'Preview'}
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading
            ? 'Uploading & Saving...'
            : formData.status === 'draft'
              ? 'Save Draft'
              : formData.status === 'scheduled'
                ? 'Schedule Post'
                : 'Publish Content'}
        </button>
      </div>
    </form>
  );
}
