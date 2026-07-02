"use client";

import { FileText } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  highlightSearchTerm,
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
  if (projects.length === 0) return null;

  return (
    <>
      <CommandGroup heading="Projects & Blogs" forceMount>
        {projects.map((project) => (
          <CommandItem
            key={project.title}
            value={project.title}
            forceMount
            onSelect={() => onSelect(() => onNavigate(project.path))}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{project.title}</span>
                <span className="shrink-0 rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">
                  {project.type}
                </span>
              </div>
              {project.context && (
                <span
                  className="mt-0.5 block max-w-full truncate text-xs text-muted-foreground/70"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(
                      project.context,
                      searchTerm,
                      searchOptions,
                    ),
                  }}
                />
              )}
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}
