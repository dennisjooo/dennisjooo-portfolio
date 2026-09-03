import type { Blog } from "@/lib/db";
import { BlogFormMetadataFields } from "./BlogFormMetadataFields";
import { BlogCoverImageField } from "./BlogCoverImageField";

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
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BlogFormMetadataFields
        formData={formData}
        onChange={onChange}
        onFormDataChange={onFormDataChange}
      />

      <div className="space-y-6">
        <BlogCoverImageField
          imageUrl={formData.imageUrl}
          uploading={uploading}
          canUploadImages={canUploadImages}
          onChange={onChange}
          onCoverImageUpload={onCoverImageUpload}
        />
      </div>
    </div>
  );
}
