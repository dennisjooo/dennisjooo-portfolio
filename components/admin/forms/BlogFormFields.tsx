import type { Blog } from "@/lib/db";
import Image from "next/image";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormField } from "@/components/admin/shared/FormField";

interface BlogFormFieldsProps {
  formData: Partial<Blog>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onFormDataChange: React.Dispatch<React.SetStateAction<Partial<Blog>>>;
  uploading: boolean;
  canUploadImages: boolean;
  onCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BlogFormFields({
  formData,
  onChange,
  onFormDataChange,
  uploading,
  canUploadImages,
  onCoverImageUpload,
}: BlogFormFieldsProps) {
  const publishAtString = formData.publishAt
    ? new Date(formData.publishAt).toISOString().slice(0, 16)
    : "";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <FormField label="Title">
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={onChange}
            className={formStyles.input}
            placeholder="Enter a catchy title..."
          />
        </FormField>

        <FormField label="Slug (Optional)">
          <input
            type="text"
            name="slug"
            value={formData.slug ?? ""}
            onChange={onChange}
            placeholder="auto-generated-from-title"
            className={`${formStyles.input} font-mono text-sm`}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type">
            <select
              name="type"
              value={formData.type}
              onChange={onChange}
              className={formStyles.input}
            >
              <option value="blog">Blog Post</option>
              <option value="project">Project</option>
            </select>
          </FormField>

          <FormField label="Status">
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className={formStyles.input}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </FormField>
        </div>

        <div
          className={`grid gap-4 ${formData.status === "scheduled" ? "grid-cols-2" : "grid-cols-1"}`}
        >
          <FormField label="Date">
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={onChange}
              className={formStyles.input}
            />
          </FormField>

          {formData.status === "scheduled" && (
            <FormField label="Publish At">
              <input
                type="datetime-local"
                value={publishAtString}
                onChange={(e) => {
                  onFormDataChange((prev) => ({
                    ...prev,
                    publishAt: e.target.value ? new Date(e.target.value) : null,
                  }));
                }}
                required
                className={formStyles.input}
              />
            </FormField>
          )}
        </div>

        <FormField label="Description">
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={onChange}
            className={formStyles.input}
            placeholder="Short summary for preview cards..."
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <FormField label="Cover Image">
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt="Cover preview"
                  fill
                  loading="lazy"
                  className="object-cover"
                  unoptimized={formData.imageUrl.startsWith("http")}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                  <PhotoIcon className="mb-2 h-12 w-12" />
                  <span className="text-xs uppercase tracking-widest">
                    {canUploadImages
                      ? "No Image Selected"
                      : "Add a title to upload images"}
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <span className="animate-pulse font-medium text-white">
                    Uploading...
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl ?? ""}
                onChange={onChange}
                placeholder="Paste image URL..."
                className={`${formStyles.input} font-mono text-xs`}
              />
              <label
                title={
                  !canUploadImages
                    ? "Add a title to enable image uploads"
                    : undefined
                }
                className={cn(
                  "flex items-center justify-center rounded-lg bg-secondary px-4 text-secondary-foreground transition-colors",
                  !canUploadImages || uploading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-secondary/80",
                )}
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={onCoverImageUpload}
                  disabled={!canUploadImages || uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </FormField>
      </div>
    </div>
  );
}
