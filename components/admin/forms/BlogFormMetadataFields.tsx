import type { Blog } from "@/lib/db/schema";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormField } from "@/components/admin/shared/FormField";
import { BLOG_STATUS_LABELS } from "@/lib/constants/blogStatus";
import { BLOG_STATUSES, BLOG_TYPES } from "@/lib/types/blog";

interface BlogFormMetadataFieldsProps {
  formData: Partial<Blog>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onFormDataChange: React.Dispatch<React.SetStateAction<Partial<Blog>>>;
}

export function BlogFormMetadataFields({
  formData,
  onChange,
  onFormDataChange,
}: BlogFormMetadataFieldsProps) {
  const publishAtString = formData.publishAt
    ? new Date(formData.publishAt).toISOString().slice(0, 16)
    : "";

  return (
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
            {BLOG_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "project" ? "Project" : "Blog Post"}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Status">
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className={formStyles.input}
          >
            {BLOG_STATUSES.map((status) => (
              <option key={status} value={status}>
                {BLOG_STATUS_LABELS[status]}
              </option>
            ))}
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
  );
}
