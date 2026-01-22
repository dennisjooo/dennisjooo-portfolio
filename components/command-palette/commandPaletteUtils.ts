"use client";

import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { extractKeywords } from "@/lib/utils/extractKeywords";
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

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Pre-processed Data (runs once at module load)
// ============================================================================

export let processedProjects: ProcessedProject[] = [];

// Helper to inject projects dynamically (if fetching on client)
export function setProcessedProjects(projects: ProcessedProject[]) {
    processedProjects = projects.map(project => {
        const slug = project.slug || createUrlSlug(project.title);
        const path = `/blogs/${slug}`;

        // Extract top keywords from blog post content
        const contentKeywords = extractKeywords(project.blogPost || '', 50);
        const descKeywords = extractKeywords(project.description || '', 20);

        return {
            ...project,
            slug,
            path,
            rawContent: `${project.title} ${project.description} ${project.blogPost}`,
            searchKeywords: [
                project.title.toLowerCase(),
                ...descKeywords,
                ...contentKeywords,
                path,
                slug,
                project.type
            ]
        };
    });
}

export let processedWorkExperience: ProcessedWorkExperience[] = [];

// Helper to inject work experience dynamically (if fetching on client)
export function setProcessedWorkExperience(experiences: ProcessedWorkExperience[]) {
    processedWorkExperience = experiences.map(work => {
        const rawContent = `${work.title} ${work.company} ${work.responsibilities.join(' ')}`;
        return {
            id: work.id,
            title: work.title,
            company: work.company,
            date: work.date,
            responsibilities: work.responsibilities,
            rawContent
        };
    });
}

// ============================================================================
// Search Utility Functions
// ============================================================================

/**
 * Finds the context snippet around a search term in text
 */
export function getContextSnippet(text: string, searchTerm: string, contextChars: number = 40): string | null {
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);

    if (index === -1) return null;

    const start = Math.max(0, index - contextChars);
    const end = Math.min(text.length, index + searchTerm.length + contextChars);

    let snippet = text.slice(start, end);

    // Add ellipsis if we're not at the boundaries
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
}

/**
 * Checks if the search term exists as an exact word in text
 */
export function hasExactWord(text: string, searchTerm: string): boolean {
    const regex = new RegExp(`\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
}

/**
 * Highlights search term in HTML string
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
    return text.replace(
        new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<mark class="bg-accent/30 text-foreground font-medium rounded px-0.5 py-px">$1</mark>'
    );
}

/**
 * Returns the appropriate icon component for a navigation item ID
 */
export function getIconForId(id: string) {
    switch (id) {
        case 'home': return Home;
        case 'about': return User;
        case 'work': return Briefcase;
        case 'projects': return FolderGit2;
        case 'skills': return Cpu;
        case 'contact': return Mail;
        case 'blogs': return FileText;
        default: return Globe;
    }
}
