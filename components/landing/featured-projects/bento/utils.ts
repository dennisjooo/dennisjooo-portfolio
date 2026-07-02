import { createUrlSlug } from "@/lib/utils/urlHelpers";
import {
  calculateReadTime,
  formatProjectDate,
} from "@/lib/utils/projectFormatting";
import type { Blog } from "@/lib/db";

export interface ProjectTileData {
  title: string;
  description: string;
  slug: string;
  date: string;
  imageUrl?: string;
  readTime?: string;
  displayIndex: number;
  animationIndex: number;
}

export interface ProjectTileProps extends ProjectTileData {
  className?: string;
}

export function formatDisplayIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function toProjectTileProps(
  project: Blog,
  displayIndex: number,
  animationIndex: number,
): ProjectTileData {
  return {
    title: project.title,
    description: project.description,
    slug: project.slug || createUrlSlug(project.title),
    date: formatProjectDate(project.date, true),
    imageUrl: project.imageUrl ?? undefined,
    readTime: `${calculateReadTime(project.blogPost)} min`,
    displayIndex,
    animationIndex,
  };
}
