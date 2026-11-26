import { isPublicVercelBlobUrl } from "@/lib/utils/blobUrls";

export function isSvgImageSrc(src: string): boolean {
  const path = src.split(/[?#]/, 1)[0];
  return path.toLowerCase().endsWith(".svg");
}

export function publicImageSrc(src: string): string {
  if (isSvgImageSrc(src) && isPublicVercelBlobUrl(src)) {
    return `/api/blob-media?url=${encodeURIComponent(src)}`;
  }
  return src;
}
