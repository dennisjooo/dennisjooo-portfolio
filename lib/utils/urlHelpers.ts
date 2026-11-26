export const createUrlSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export function resolveBlogSlug(title: string, slug?: string | null): string {
  return slug || createUrlSlug(title);
}
