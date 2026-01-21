"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    processedProjects,
    setProcessedProjects,
    processedWorkExperience,
    getContextSnippet,
    type ProcessedProject,
    type ProcessedWorkExperience,
} from "@/components/command-palette/commandPaletteUtils";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";

// ============================================================================
// Types
// ============================================================================

export type SearchScope = "all" | "projects" | "work";

export interface FilteredProject extends ProcessedProject {
    context: string | null;
}

export interface FilteredWorkExperience extends ProcessedWorkExperience {
    context: string | null;
}

export interface UseCommandPaletteReturn {
    // State
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    copied: boolean;
    exactMatch: boolean;
    setExactMatch: React.Dispatch<React.SetStateAction<boolean>>;
    caseSensitive: boolean;
    setCaseSensitive: React.Dispatch<React.SetStateAction<boolean>>;
    searchScope: SearchScope;
    setSearchScope: React.Dispatch<React.SetStateAction<SearchScope>>;

    // Derived state
    showSecretCommand: boolean;
    filteredProjects: FilteredProject[];
    filteredWorkExperience: FilteredWorkExperience[];

    // Actions
    runCommand: (command: () => unknown) => void;
    copyUrl: () => void;
    router: ReturnType<typeof useRouter>;
}

// ============================================================================
// Helper Functions
// ============================================================================

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createSearchMatcher(
    term: string,
    options: { caseSensitive: boolean; exactMatch: boolean }
): (text: string) => boolean {
    const { caseSensitive, exactMatch } = options;

    if (exactMatch) {
        const escaped = escapeRegex(term);
        const flags = caseSensitive ? '' : 'i';
        const regex = new RegExp(`\\b${escaped}\\b`, flags);
        return (text: string) => regex.test(text);
    }

    // Simple substring match
    if (caseSensitive) {
        return (text: string) => text.includes(term);
    }
    const lowerTerm = term.toLowerCase();
    return (text: string) => text.toLowerCase().includes(lowerTerm);
}

// ============================================================================
// Hook
// ============================================================================

export function useCommandPalette(): UseCommandPaletteReturn {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [exactMatch, setExactMatch] = React.useState(false);
    const [caseSensitive, setCaseSensitive] = React.useState(false);
    const [searchScope, setSearchScope] = React.useState<SearchScope>("all");
    const router = useRouter();
    const { copied, copyToClipboard } = useCopyToClipboard();

    // Fetch projects when command palette opens
    React.useEffect(() => {
        if (open && processedProjects.length === 0) {
            fetch('/api/blogs')
                .then(res => res.json())
                .then(data => {
                    setProcessedProjects(data);
                })
                .catch(err => console.error("Failed to fetch projects for command palette", err));
        }
    }, [open]);

    // Keyboard shortcut (Ctrl/Cmd + K) and custom event listener
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const openPalette = () => setOpen(true);

        document.addEventListener("keydown", down);
        document.addEventListener("openCommandPalette", openPalette);
        return () => {
            document.removeEventListener("keydown", down);
            document.removeEventListener("openCommandPalette", openPalette);
        };
    }, []);

    // Run command and close palette
    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    // Check if search contains secret keywords for easter egg
    const showSecretCommand = React.useMemo(() => {
        const normalizedSearch = search.toLowerCase();
        return normalizedSearch.includes("rick") ||
            normalizedSearch.includes("bitcoin") ||
            normalizedSearch.includes("free");
    }, [search]);

    // Copy current URL to clipboard
    const copyUrl = React.useCallback(() => {
        if (typeof window !== "undefined") {
            copyToClipboard(window.location.href);
            runCommand(() => { });
        }
    }, [copyToClipboard, runCommand]);

    // Create matcher based on search options
    const matcher = React.useMemo(() => {
        if (!search.trim()) return null;
        return createSearchMatcher(search.trim(), { caseSensitive, exactMatch });
    }, [search, caseSensitive, exactMatch]);

    // Filtered projects with context
    const filteredProjects = React.useMemo((): FilteredProject[] => {
        if (!search.trim() || !matcher || searchScope === "work") return [];

        const term = search.trim();

        return processedProjects
            .map(project => {
                if (!matcher(project.rawContent)) return null;

                const context = getContextSnippet(project.rawContent, term);
                return { ...project, context };
            })
            .filter((p): p is FilteredProject => p !== null);
    }, [search, matcher, searchScope, open]); // Added open to trigger re-calc after fetch

    // Filtered work experience with context
    const filteredWorkExperience = React.useMemo((): FilteredWorkExperience[] => {
        if (!search.trim() || !matcher || searchScope === "projects") return [];

        const term = search.trim();

        return processedWorkExperience
            .map(work => {
                if (!matcher(work.rawContent)) return null;

                const context = getContextSnippet(work.rawContent, term);
                return { ...work, context };
            })
            .filter((w): w is FilteredWorkExperience => w !== null);
    }, [search, matcher, searchScope]);

    return {
        open,
        setOpen,
        search,
        setSearch,
        copied,
        exactMatch,
        setExactMatch,
        caseSensitive,
        setCaseSensitive,
        searchScope,
        setSearchScope,
        showSecretCommand,
        filteredProjects,
        filteredWorkExperience,
        runCommand,
        copyUrl,
        router,
    };
}
