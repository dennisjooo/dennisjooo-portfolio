"use client";

import type { Blog } from "@/lib/db";
import { EyeIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { formStyles } from "@/components/admin/shared/formStyles";
import { useBlogForm } from "@/components/admin/hooks/useBlogForm";
import { BlogFormFields } from "./BlogFormFields";
import { LinkManager } from "./LinkManager";
import { MarkdownEditor } from "@/components/admin/editors/MarkdownEditor";

interface BlogFormProps {
  initialData?: Blog;
  onSubmit: (data: Partial<Blog>) => Promise<void>;
}

export function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const {
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
  } = useBlogForm({ initialData, onSubmit });

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        formStyles.panel,
        "space-y-8",
        editorMode === "split" ? "max-w-7xl" : "max-w-4xl",
      )}
    >
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
        onUpdate={updateLink}
        onReorder={reorderLinks}
      />

      <MarkdownEditor
        content={formData.blogPost || ""}
        onChange={handleChange}
        onContentChange={(content) =>
          setFormData((prev) => ({ ...prev, blogPost: content }))
        }
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        canUploadImages={canUploadImages}
        onInsertImage={insertImageToMarkdown}
        textareaRef={textareaRef}
      />

      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <button
          type="button"
          onClick={handlePreview}
          disabled={previewing || !formData.title}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <EyeIcon className="h-4 w-4" />
          {previewing ? "Creating Preview..." : "Preview"}
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading
            ? "Uploading & Saving..."
            : formData.status === "draft"
              ? "Save Draft"
              : formData.status === "scheduled"
                ? "Schedule Post"
                : "Publish Content"}
        </button>
      </div>
    </form>
  );
}
