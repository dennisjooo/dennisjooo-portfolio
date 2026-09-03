"use client";

import { useCallback } from "react";
import type { Blog } from "@/lib/db";
import { toast } from "sonner";
import {
  type PendingImage,
  processBlogContent,
  deleteOrphanedImages,
} from "@/lib/admin/blogContentProcessing";

interface UseBlogFormActionsOptions {
  formData: Partial<Blog>;
  pendingImages: PendingImage[];
  initialData?: Blog;
  onSubmit: (data: Partial<Blog>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setPreviewing: (previewing: boolean) => void;
}

export function useBlogFormActions({
  formData,
  pendingImages,
  initialData,
  onSubmit,
  setLoading,
  setPreviewing,
}: UseBlogFormActionsOptions) {
  const handlePreview = useCallback(async () => {
    if (!formData.title) {
      toast.error("Add a title before previewing");
      return;
    }

    setPreviewing(true);
    try {
      const previewContent = await processBlogContent(
        formData.blogPost || "",
        pendingImages,
        { title: formData.title, slug: formData.slug ?? undefined },
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
  }, [formData, pendingImages, setPreviewing]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const finalContent = await processBlogContent(
          formData.blogPost || "",
          pendingImages,
          { title: formData.title, slug: formData.slug ?? undefined },
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
    },
    [formData, pendingImages, initialData, onSubmit, setLoading],
  );

  return { handlePreview, handleSubmit };
}
