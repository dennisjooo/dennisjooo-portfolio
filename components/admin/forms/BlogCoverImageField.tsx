import Image from "next/image";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormField } from "@/components/admin/shared/FormField";

interface BlogCoverImageFieldProps {
  imageUrl?: string | null;
  uploading: boolean;
  canUploadImages: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BlogCoverImageField({
  imageUrl,
  uploading,
  canUploadImages,
  onChange,
  onCoverImageUpload,
}: BlogCoverImageFieldProps) {
  return (
    <FormField label="Cover Image">
      <div className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Cover preview"
              fill
              loading="lazy"
              className="object-cover"
              unoptimized={imageUrl.startsWith("http")}
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
            value={imageUrl ?? ""}
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
  );
}
