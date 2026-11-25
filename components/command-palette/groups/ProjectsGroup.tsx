"use client";

import { FileText } from "lucide-react";
import { SearchResultGroup } from "./SearchResultGroup";
import {
  type FilteredProject,
  type SearchOptions,
} from "@/lib/command-palette/utils";

interface ProjectsGroupProps {
  projects: FilteredProject[];
  searchTerm: string;
  searchOptions: SearchOptions;
  onSelect: (command: () => unknown) => void;
  onNavigate: (path: string) => void;
}

export function ProjectsGroup({
  projects,
  searchTerm,
  searchOptions,
  onSelect,
  onNavigate,
}: ProjectsGroupProps) {
  return (
    <SearchResultGroup
      heading="Projects & Blogs"
      items={projects}
      searchTerm={searchTerm}
      searchOptions={searchOptions}
      icon={FileText}
      getKey={(project) => project.title}
      getValue={(project) => project.title}
      renderPrimary={(project) => project.title}
      renderBadge={(project) => (
        <span className="shrink-0 rounded bg-muted/50 px-1.5 py-0.5 font-sans text-xs text-muted-foreground/80">
          {project.type}
        </span>
      )}
      getContext={(project) => project.context}
      onSelect={onSelect}
      onItemSelect={(project) => onNavigate(project.path)}
    />
  );
}
