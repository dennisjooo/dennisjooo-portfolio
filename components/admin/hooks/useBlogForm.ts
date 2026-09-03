"use client";

import { useState, useRef, useEffect } from "react";
import type { Blog } from "@/lib/db";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { useImageUpload } from "@/lib/hooks/domain/useImageUpload";
import { useFormDirty } from "@/components/admin/hooks/useUnsavedChanges";
import type { EditorMode } from "@/components/admin/editors/MarkdownEditor";
import {
  createBlogFormChangeHandler,
  createBlogFormLinkHandlers,
} from "./blogFormHandlers";
import { useBlogFormMarkdownImages } from "./useBlogFormMarkdownImages";
import { useBlogFormActions } from "./useBlogFormActions";

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

  const { pendingImages, insertImageToMarkdown } = useBlogFormMarkdownImages(
    formData.blogPost,
    (content) => setFormData((prev) => ({ ...prev, blogPost: content })),
    textareaRef,
  );

  const { handlePreview, handleSubmit } = useBlogFormActions({
    formData,
    pendingImages,
    initialData,
    onSubmit,
    setLoading,
    setPreviewing,
  });

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

  const handleChange = createBlogFormChangeHandler(
    setFormData,
    slugManuallyEdited,
  );

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.[0]) return;
    await uploadCoverImage(e.target.files[0]);
  };

  const { addLink, removeLink, updateLink, reorderLinks } =
    createBlogFormLinkHandlers(setFormData);

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
