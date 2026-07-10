"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  processedProjects,
  setProcessedProjects,
  processedWorkExperience,
  setProcessedWorkExperience,
  getContextSnippet,
  matchesSearch,
  type ProcessedProject,
  type ProcessedWorkExperience,
  type SearchOptions,
} from "@/lib/command-palette/utils";
import { useCopyToClipboard } from "@/lib/hooks/domain/useCopyToClipboard";
import { matchSecrets } from "@/lib/easter-eggs/matchSecrets";
import { PALETTE_SECRETS } from "@/lib/easter-eggs/secrets";
import type { SecretDefinition } from "@/lib/easter-eggs/types";

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
  matchedSecrets: SecretDefinition[];
  filteredProjects: FilteredProject[];
  filteredWorkExperience: FilteredWorkExperience[];

  // Actions
  runCommand: (command: () => unknown) => void;
  copyUrl: () => void;
  router: ReturnType<typeof useRouter>;
}

export function useCommandPalette(): UseCommandPaletteReturn {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [exactMatch, setExactMatch] = React.useState(false);
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [searchScope, setSearchScope] = React.useState<SearchScope>("all");
  const router = useRouter();
  const { copied, copyToClipboard } = useCopyToClipboard();

  React.useEffect(() => {
    if (open) {
      if (
        processedProjects.length === 0 ||
        processedWorkExperience.length === 0
      ) {
        fetch("/api/search-index")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setProcessedProjects(data.data.projects);
              setProcessedWorkExperience(data.data.workExperience);
              return;
            }
            throw new Error("Search index payload missing success flag");
          })
          .catch((err) => {
            console.error(
              "Failed to fetch search index for command palette",
              err,
            );
            Promise.all([
              fetch("/api/blogs").then((res) => res.json()),
              fetch("/api/work-experience").then((res) => res.json()),
            ])
              .then(([blogsData, workData]) => {
                if (blogsData?.data) {
                  setProcessedProjects(blogsData.data);
                }
                if (workData?.success && workData?.data) {
                  setProcessedWorkExperience(workData.data);
                }
              })
              .catch((fallbackError) => {
                console.error(
                  "Failed to fetch fallback command palette data",
                  fallbackError,
                );
              });
          });
      }
    }
  }, [open]);

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

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const matchedSecrets = React.useMemo(
    () => matchSecrets(search, PALETTE_SECRETS),
    [search],
  );

  const copyUrl = React.useCallback(() => {
    if (typeof window !== "undefined") {
      copyToClipboard(window.location.href);
      runCommand(() => {});
    }
  }, [copyToClipboard, runCommand]);

  const searchOptions = React.useMemo(
    (): SearchOptions => ({ caseSensitive, exactMatch }),
    [caseSensitive, exactMatch],
  );

  const filteredProjects = React.useMemo((): FilteredProject[] => {
    if (!search.trim() || searchScope === "work") return [];

    const term = search.trim();

    return processedProjects
      .map((project) => {
        if (!matchesSearch(project.rawContent, term, searchOptions))
          return null;

        const context = getContextSnippet(
          project.rawContent,
          term,
          searchOptions,
        );
        return { ...project, context };
      })
      .filter((p): p is FilteredProject => p !== null);
  }, [search, searchOptions, searchScope]);

  const filteredWorkExperience = React.useMemo((): FilteredWorkExperience[] => {
    if (!search.trim() || searchScope === "projects") return [];

    const term = search.trim();

    return processedWorkExperience
      .map((work) => {
        if (!matchesSearch(work.rawContent, term, searchOptions)) return null;

        const context = getContextSnippet(work.rawContent, term, searchOptions);
        return { ...work, context };
      })
      .filter((w): w is FilteredWorkExperience => w !== null);
  }, [search, searchOptions, searchScope]);

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
    matchedSecrets,
    filteredProjects,
    filteredWorkExperience,
    runCommand,
    copyUrl,
    router,
  };
}
