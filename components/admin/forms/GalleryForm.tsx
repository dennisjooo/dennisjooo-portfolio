"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import type { GalleryImage } from "@/lib/db";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormActions } from "@/components/admin/shared/FormActions";
import { FormField } from "@/components/admin/shared/FormField";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { useFormSubmit } from "@/components/admin/hooks/useFormSubmit";
import {
  useFormDirty,
  useUnsavedChanges,
} from "@/components/admin/hooks/useUnsavedChanges";
import { useGalleryUpload } from "@/lib/hooks/domain/useGalleryUpload";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { GalleryExifPills } from "@/components/gallery/GalleryExifPills";
import { extractGalleryExif } from "@/lib/utils/galleryExif";
import { cn } from "@/lib/utils";

interface GalleryFormProps {
  initialData?: GalleryImage;
  onSubmit: (data: Partial<GalleryImage>) => Promise<void>;
}

export default function GalleryForm({
  initialData,
  onSubmit,
}: GalleryFormProps) {
  const { loading, handleSubmit } = useFormSubmit();
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();
  const slugManuallyEdited = useRef(Boolean(initialData?.slug));
  const fallbackSlug = useRef(`img-${Date.now()}`);
  const pendingBlob = useRef<Blob | null>(null);
  const originalExif = useRef<typeof formData.exif>(initialData?.exif ?? null);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    slug: initialData?.slug ?? "",
    thumbUrl: initialData?.thumbUrl ?? "",
    fullUrl: initialData?.fullUrl ?? "",
    width: initialData?.width ?? null,
    height: initialData?.height ?? null,
    exif: initialData?.exif ?? null,
  });

  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useFormDirty(formData);

  const effectiveSlug =
    formData.slug ||
    createUrlSlug(formData.title || "") ||
    fallbackSlug.current;

  const { uploading, upload } = useGalleryUpload({
    slug: effectiveSlug,
    onSuccess: (result) => {
      setFormData((prev) => ({
        ...prev,
        thumbUrl: result.thumbUrl,
        fullUrl: result.fullUrl,
        width: result.width,
        height: result.height,
        exif: result.exif,
      }));
    },
  });

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited.current ? prev.slug : createUrlSlug(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    if (!value.trim()) {
      slugManuallyEdited.current = false;
      setFormData((prev) => ({
        ...prev,
        slug: createUrlSlug(prev.title || ""),
      }));
      return;
    }

    slugManuallyEdited.current = true;
    setFormData((prev) => ({ ...prev, slug: createUrlSlug(value) }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const exif = await extractGalleryExif(file);
    if (exif) {
      originalExif.current = exif;
      setFormData((prev) => ({ ...prev, exif }));
    }

    pendingBlob.current = file;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submitGallery = async () => {
    const hasPending = !!pendingBlob.current;
    const hasExisting = !!formData.thumbUrl && !!formData.fullUrl;

    if (!hasPending && !hasExisting) {
      toast.error("Select an image before saving");
      return;
    }

    let uploadData: {
      slug?: string;
      thumbUrl?: string;
      fullUrl?: string;
      width?: number | null;
      height?: number | null;
      exif?: typeof formData.exif;
    } = {};

    if (hasPending) {
      const result = await upload(pendingBlob.current!);
      if (!result) return;
      pendingBlob.current = null;
      uploadData = {
        slug: result.slug,
        thumbUrl: result.thumbUrl,
        fullUrl: result.fullUrl,
        width: result.width,
        height: result.height,
        exif: result.exif || originalExif.current,
      };
    }

    const payload = {
      ...formData,
      slug: uploadData.slug || effectiveSlug,
      ...uploadData,
      description: formData.description?.trim() || null,
    };

    await onSubmit(payload);
  };

  const previewSrc = localPreview || formData.thumbUrl;

  return (
    <form
      onSubmit={(e) => handleSubmit(e, submitGallery)}
      className="mx-auto max-w-6xl space-y-4"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        {/* Left: photo preview */}
        <div className="flex justify-center">
          {previewSrc ? (
            <div className="group relative inline-block max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Gallery preview"
                className="max-h-[560px] w-auto max-w-full rounded-2xl border border-border bg-muted/10 object-contain"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <label
                  htmlFor="gallery-upload"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                >
                  <PhotoIcon className="h-3.5 w-3.5" />
                  Replace
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor="gallery-upload-empty"
              className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/10 px-6 transition-colors hover:border-muted-foreground/40 hover:bg-muted/20"
            >
              <div className="rounded-full border-2 border-dashed border-border p-5">
                <PhotoIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Select a photo
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Uploads the masterwork here lmao
                </p>
              </div>
              <input
                id="gallery-upload-empty"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Right: form fields */}
        <div className="space-y-5">
          <FormField label="Title" hint="Leave blank for 'Untitled'">
            <input
              type="text"
              className={formStyles.input}
              placeholder="e.g. Golden Hour in Tokyo"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </FormField>

          <FormField label="Slug" hint="Auto-generated if blank">
            <input
              type="text"
              className={formStyles.input}
              placeholder="golden-hour-tokyo"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
            />
          </FormField>

          <FormField label="Description">
            <AutoResizeTextarea
              className={cn(formStyles.input, "min-h-[4rem]")}
              placeholder="Brief description..."
              value={formData.description ?? ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
            />
          </FormField>

          {formData.exif && (
            <div className={cn(formStyles.panel, "space-y-3")}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                EXIF Data
              </p>
              <GalleryExifPills exif={formData.exif} />
            </div>
          )}
        </div>
      </div>

      <FormActions
        loading={loading || uploading}
        submitLabel={initialData ? "Update Image" : "Create Image"}
        onCancel={() => requestNavigation(() => router.back())}
      />
    </form>
  );
}
