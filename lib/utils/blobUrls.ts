const BLOB_HOST_MARKER = "vercel-storage.com";
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";
const BLOB_URL_PATTERN =
  /https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s)#]+/g;

export function isPublicVercelBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" && parsed.hostname.endsWith(BLOB_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}

export function extractBlobUrls(
  imageUrl: string | null,
  blogPost: string | null,
): string[] {
  const urls = new Set<string>();

  if (imageUrl?.includes(BLOB_HOST_MARKER)) {
    urls.add(imageUrl);
  }

  if (blogPost) {
    for (const match of blogPost.matchAll(BLOB_URL_PATTERN)) {
      urls.add(match[0]);
    }
  }

  return [...urls];
}
