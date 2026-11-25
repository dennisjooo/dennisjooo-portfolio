export type BlogListType = "project" | "blog";

export interface BlogListItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  type: BlogListType;
  slug: string | null;
  readTimeMinutes: number;
}
