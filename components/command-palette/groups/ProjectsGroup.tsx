"use client";

import { FileText } from "lucide-react";
import { SearchResultGroup } from "./SearchResultGroup";
import {
  type ProcessedProject,
  type SearchOptions,
} from "@/lib/command-palette/utils";

interface FilteredProject extends ProcessedProject {
  context: string | null;
}

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
        <span className="shrink-0 rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">
          {project.type}
        </span>
      )}
      getContext={(project) => project.context}
      onSelect={onSelect}
      onItemSelect={(project) => onNavigate(project.path)}
    />
  );
}
