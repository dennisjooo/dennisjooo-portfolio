"use client";

import { useState, useRef, useEffect } from "react";
import type { Blog } from "@/lib/db";
import { toast } from "sonner";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { useImageUpload } from "@/lib/hooks/domain/useImageUpload";
import { useFormDirty } from "@/components/admin/hooks/useUnsavedChanges";
import type { EditorMode } from "@/components/admin/editors/MarkdownEditor";
import {
  type PendingImage,
  processBlogContent,
  deleteOrphanedImages,
} from "@/lib/admin/blogContentProcessing";

interface UseBlogFormOptions {
  initialData?: Blog;
  onSubmit: (data: Partial<Blog>) => Promise<void>;
}

export function useBlogForm({ initialData, onSubmit }: UseBlogFormOptions) {
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "blog",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    imageUrl: initialData?.imageUrl || "",
    blogPost: initialData?.blogPost || "",
    links: initialData?.links || [],
    slug: initialData?.slug || "",
    status: initialData?.status || "draft",
    publishAt: initialData?.publishAt || null,
  });

  const [editorMode, setEditorMode] = useState<EditorMode>("write");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slugManuallyEdited = useRef(Boolean(initialData?.slug));

  useFormDirty(formData);

  const effectiveSlug = formData.slug || createUrlSlug(formData.title || "");
  const canUploadImages = Boolean(effectiveSlug);
  const imageFolder = effectiveSlug ? `blog/${effectiveSlug}` : undefined;

  const { uploading, upload: uploadCoverImage } = useImageUpload({
    folder: imageFolder,
    onSuccess: (url) => setFormData((prev) => ({ ...prev, imageUrl: url })),
  });

  useEffect(() => {
    return () => {
      pendingImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [pendingImages]);

  useEffect(() => {
    if (!effectiveSlug) return;
    const previewSlug = `${effectiveSlug}-preview`;
    fetch("/api/blogs/preview", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: previewSlug }),
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editorMode === "split") return;
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [formData.blogPost, editorMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "slug") {
      if (value.length === 0) {
        slugManuallyEdited.current = false;
        setFormData((prev) => ({
          ...prev,
          slug: createUrlSlug(prev.title || ""),
        }));
      } else {
        slugManuallyEdited.current = true;
        setFormData((prev) => ({ ...prev, slug: value }));
      }
      return;
    }

    if (name === "title" && !slugManuallyEdited.current) {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: createUrlSlug(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.[0]) return;
    await uploadCoverImage(e.target.files[0]);
  };

  const addLink = (link: { text: string; url: string }) => {
    setFormData((prev) => ({
      ...prev,
      links: [...(prev.links || []), link],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index: number, link: { text: string; url: string }) => {
    setFormData((prev) => {
      const next = [...(prev.links || [])];
      next[index] = link;
      return { ...prev, links: next };
    });
  };

  const reorderLinks = (links: { text: string; url: string }[]) => {
    setFormData((prev) => ({ ...prev, links }));
  };

  const insertImageToMarkdown = (file: File) => {
    const id = Math.random().toString(36).substring(7);
    const previewUrl = URL.createObjectURL(file);

    setPendingImages((prev) => [...prev, { id, file, previewUrl }]);

    const imageMarkdown = `![Image](${previewUrl})`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.blogPost || "";
      const newText =
        text.substring(0, start) + imageMarkdown + text.substring(end);

      setFormData((prev) => ({ ...prev, blogPost: newText }));

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + imageMarkdown.length,
          start + imageMarkdown.length,
        );
      }, 0);
    } else {
      setFormData((prev) => ({
        ...prev,
        blogPost: (prev.blogPost || "") + "\n" + imageMarkdown,
      }));
    }
  };

  const handlePreview = async () => {
    if (!formData.title) {
      toast.error("Add a title before previewing");
      return;
    }

    setPreviewing(true);
    try {
      const previewContent = await processBlogContent(
        formData.blogPost || "",
        pendingImages,
        { title: formData.title, slug: formData.slug },
      );
      const response = await fetch("/api/blogs/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, blogPost: previewContent }),
      });

      if (!response.ok) throw new Error("Failed to create preview");
      const { data } = await response.json();
      window.open(`/blogs/${data.slug}?preview=true`, "_blank");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create preview");
    } finally {
      setPreviewing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalContent = await processBlogContent(
        formData.blogPost || "",
        pendingImages,
        { title: formData.title, slug: formData.slug },
      );

      if (initialData) {
        await deleteOrphanedImages(
          initialData.blogPost || "",
          initialData.imageUrl,
          finalContent,
          formData.imageUrl,
        );
      }

      const submitData = { ...formData, blogPost: finalContent };
      if (submitData.status !== "scheduled") {
        submitData.publishAt = null;
      }
      await onSubmit(submitData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    editorMode,
    setEditorMode,
    loading,
    previewing,
    uploading,
    canUploadImages,
    textareaRef,
    handleChange,
    handleCoverImageUpload,
    addLink,
    removeLink,
    updateLink,
    reorderLinks,
    insertImageToMarkdown,
    handlePreview,
    handleSubmit,
  };
}
