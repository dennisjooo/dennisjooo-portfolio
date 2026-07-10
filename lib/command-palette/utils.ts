import { createUrlSlug } from "@/lib/utils/urlHelpers";
import {
  Home,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Mail,
  Globe,
  FileText,
} from "lucide-react";

export interface ProcessedProject {
  title: string;
  description: string;
  blogPost: string;
  type: string;
  slug: string;
  path: string;
  rawContent: string;
  searchKeywords: string[];
  context?: string | null;
}

export interface ProcessedWorkExperience {
  id: string;
  title: string;
  company: string;
  date: string;
  responsibilities: string[];
  rawContent: string;
  context?: string | null;
}

export let processedProjects: ProcessedProject[] = [];

export function setProcessedProjects(projects: ProcessedProject[]) {
  processedProjects = projects.map((project) => {
    const slug = project.slug || createUrlSlug(project.title);
    const path = `/blogs/${slug}`;
    const bodySnippet = (project.blogPost || "").slice(0, 1200);
    const rawContent = `${project.title} ${project.description} ${bodySnippet}`;

    return {
      ...project,
      blogPost: bodySnippet,
      slug,
      path,
      rawContent,
      searchKeywords: [
        project.title.toLowerCase(),
        project.description.toLowerCase(),
        path,
        slug,
        project.type,
      ],
    };
  });
}

export let processedWorkExperience: ProcessedWorkExperience[] = [];

export function setProcessedWorkExperience(
  experiences: ProcessedWorkExperience[],
) {
  processedWorkExperience = experiences.map((work) => {
    const rawContent = `${work.title} ${work.company} ${work.responsibilities.join(" ")}`;
    return {
      id: work.id,
      title: work.title,
      company: work.company,
      date: work.date,
      responsibilities: work.responsibilities,
      rawContent,
    };
  });
}

export interface SearchOptions {
  caseSensitive: boolean;
  exactMatch: boolean;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildWholeWordPattern(escaped: string): string {
  // Treat dots as part of identifiers (e.g. "Three.js") so whole-word
  // search does not match a prefix before a file extension or package name.
  return `(?<![\\w.])${escaped}(?![\\w.])`;
}

function buildSearchRegex(
  term: string,
  options: SearchOptions,
  global = false,
): RegExp | null {
  if (!term) return null;

  const escaped = escapeRegex(term);
  const pattern = options.exactMatch ? buildWholeWordPattern(escaped) : escaped;
  const flags = `${options.caseSensitive ? "" : "i"}${global ? "g" : ""}`;

  return new RegExp(pattern, flags);
}

export function matchesSearch(
  text: string,
  term: string,
  options: SearchOptions,
): boolean {
  const regex = buildSearchRegex(term, options);
  if (!regex) return false;
  return regex.test(text);
}

export function getContextSnippet(
  text: string,
  searchTerm: string,
  options: SearchOptions,
  contextChars: number = 40,
): string | null {
  const regex = buildSearchRegex(searchTerm, options);
  if (!regex) return null;

  const match = regex.exec(text);
  if (!match) return null;

  const index = match.index;
  const matchLength = match[0].length;

  const start = Math.max(0, index - contextChars);
  const end = Math.min(text.length, index + matchLength + contextChars);

  let snippet = text.slice(start, end);

  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  options: SearchOptions,
): string {
  const regex = buildSearchRegex(searchTerm, options, true);
  if (!regex) return text;

  return text.replace(
    regex,
    '<mark class="bg-accent/30 text-foreground font-medium rounded px-0.5 py-px">$&</mark>',
  );
}

export function getIconForId(id: string) {
  switch (id) {
    case "home":
      return Home;
    case "about":
      return User;
    case "work":
      return Briefcase;
    case "projects":
      return FolderGit2;
    case "skills":
      return Cpu;
    case "contact":
      return Mail;
    case "blogs":
      return FileText;
    default:
      return Globe;
  }
}
