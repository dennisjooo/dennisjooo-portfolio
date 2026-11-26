export const BLOG_TYPES = ["project", "blog"] as const;
export type BlogType = (typeof BLOG_TYPES)[number];

export const BLOG_STATUSES = ["draft", "scheduled", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export function isBlogType(value: string | null): value is BlogType {
  return BLOG_TYPES.includes(value as BlogType);
}

export function isBlogStatus(value: string | null): value is BlogStatus {
  return BLOG_STATUSES.includes(value as BlogStatus);
}
