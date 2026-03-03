import { Blog } from '@/lib/db';
import Image from 'next/image';
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formStyles } from './shared/formStyles';
import { FormField } from './shared/FormField';

interface BlogFormFieldsProps {
  formData: Partial<Blog>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
    : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            value={formData.slug ?? ''}
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

        <div className={`grid gap-4 ${formData.status === 'scheduled' ? 'grid-cols-2' : 'grid-cols-1'}`}>
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

          {formData.status === 'scheduled' && (
            <FormField label="Publish At">
              <input
                type="datetime-local"
                value={publishAtString}
                onChange={(e) => {
                  onFormDataChange(prev => ({
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
                  <span className="text-xs uppercase tracking-widest">
                    {canUploadImages ? 'No Image Selected' : 'Add a title to upload images'}
                  </span>
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
                onChange={onChange}
                placeholder="Paste image URL..."
                className={`${formStyles.input} text-xs font-mono`}
              />
              <label
                title={!canUploadImages ? 'Add a title to enable image uploads' : undefined}
                className={cn(
                  "flex items-center justify-center px-4 bg-secondary text-secondary-foreground rounded-lg transition-colors",
                  !canUploadImages || uploading
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer hover:bg-secondary/80"
                )}
              >
                <ArrowUpTrayIcon className="w-5 h-5" />
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
