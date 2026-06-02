"use client";

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
    processedProjects = projects.map(project => {
        const slug = project.slug || createUrlSlug(project.title);
        const path = `/blogs/${slug}`;
        const bodySnippet = (project.blogPost || '').slice(0, 1200);
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
                project.type
            ]
        };
    });
}

export let processedWorkExperience: ProcessedWorkExperience[] = [];

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

export function getContextSnippet(text: string, searchTerm: string, contextChars: number = 40): string | null {
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);

    if (index === -1) return null;

    const start = Math.max(0, index - contextChars);
    const end = Math.min(text.length, index + searchTerm.length + contextChars);

    let snippet = text.slice(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
}

export function hasExactWord(text: string, searchTerm: string): boolean {
    const regex = new RegExp(`\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
    return text.replace(
        new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<mark class="bg-accent/30 text-foreground font-medium rounded px-0.5 py-px">$1</mark>'
    );
}

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
