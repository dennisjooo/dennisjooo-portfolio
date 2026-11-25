export const PREVIEW_SLUG_SUFFIX = "-preview";

export function toPreviewSlug(baseSlug: string): string {
  return `${baseSlug}${PREVIEW_SLUG_SUFFIX}`;
}

export function isPreviewSlug(slug: string): boolean {
  return slug.endsWith(PREVIEW_SLUG_SUFFIX);
}

export function stripPreviewSlug(slug: string): string {
  return isPreviewSlug(slug)
    ? slug.slice(0, -PREVIEW_SLUG_SUFFIX.length)
    : slug;
}
