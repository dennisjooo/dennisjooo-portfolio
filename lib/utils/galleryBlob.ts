const GALLERY_BLOB_PATTERN =
  /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/gallery\/[^/]+\/(thumb|full)\.webp$/;

export function isGalleryBlobUrl(url: string): boolean {
  return GALLERY_BLOB_PATTERN.test(url);
}

export function getGalleryBlobUrls(
  thumbUrl: string | null,
  fullUrl: string | null,
): string[] {
  const urls: string[] = [];
  if (thumbUrl && isGalleryBlobUrl(thumbUrl)) urls.push(thumbUrl);
  if (fullUrl && isGalleryBlobUrl(fullUrl) && fullUrl !== thumbUrl) {
    urls.push(fullUrl);
  }
  return urls;
}
