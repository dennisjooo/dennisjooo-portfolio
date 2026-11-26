import type { BlogType } from "./blog";

export type BlogListType = BlogType;

export interface BlogListItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  type: BlogListType;
  slug: string;
  readTimeMinutes: number;
}
