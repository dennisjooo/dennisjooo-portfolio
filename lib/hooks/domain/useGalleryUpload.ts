"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { buildUploadPayload } from "@/lib/utils/blobUpload";
import { drawScaledToBlob } from "@/lib/utils/imageResize";
import type { GalleryExif } from "@/lib/db";

const MAX_UPLOAD_DIMENSION = 4096;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

async function prepareForUpload(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;

  if (
    blob.size <= MAX_UPLOAD_BYTES &&
    width <= MAX_UPLOAD_DIMENSION &&
    height <= MAX_UPLOAD_DIMENSION
  ) {
    bitmap.close();
    return blob;
  }

  try {
    const resized = await drawScaledToBlob(
      bitmap,
      width,
      height,
      MAX_UPLOAD_DIMENSION,
    );
    return resized ?? blob;
  } catch {
    return blob;
  } finally {
    bitmap.close();
  }
}

export interface GalleryUploadResult {
  slug: string;
  thumbUrl: string;
  fullUrl: string;
  width: number | null;
  height: number | null;
  exif: GalleryExif | null;
}

interface UseGalleryUploadOptions {
  slug: string;
  onSuccess?: (result: GalleryUploadResult) => void;
}

export function useGalleryUpload({ slug, onSuccess }: UseGalleryUploadOptions) {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (input: File | Blob): Promise<GalleryUploadResult | null> => {
      if (!slug) {
        toast.error("Enter a title first to generate a slug");
        return null;
      }

      setUploading(true);
      try {
        const sized = await prepareForUpload(input);
        const file =
          sized instanceof File
            ? sized
            : new File([sized], "edited.jpg", { type: sized.type });
        const { body } = await buildUploadPayload(file);

        const params = new URLSearchParams({ slug });
        const response = await fetch(
          `/api/gallery/upload?${params.toString()}`,
          {
            method: "POST",
            body,
          },
        );

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        const result = data.data as GalleryUploadResult;
        onSuccess?.(result);
        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        toast.error(message);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [slug, onSuccess],
  );

  return { uploading, upload };
}
