"use client";

import * as React from "react";
import {
  processedProjects,
  processedWorkExperience,
  getContextSnippet,
  matchesSearch,
  type FilteredProject,
  type FilteredWorkExperience,
  type SearchOptions,
} from "@/lib/command-palette/utils";

export type SearchScope = "all" | "projects" | "work";
export type { FilteredProject, FilteredWorkExperience };

export function useCommandPaletteFiltering(
  search: string,
  searchScope: SearchScope,
  searchOptions: SearchOptions,
) {
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

  return { filteredProjects, filteredWorkExperience };
}
