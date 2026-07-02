"use client";

import { Briefcase } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  highlightSearchTerm,
  type ProcessedWorkExperience,
  type SearchOptions,
} from "@/lib/command-palette/utils";

interface FilteredWorkExperience extends ProcessedWorkExperience {
  context: string | null;
}

interface WorkExperienceGroupProps {
  workExperience: FilteredWorkExperience[];
  searchTerm: string;
  searchOptions: SearchOptions;
  onSelect: (command: () => unknown) => void;
  onNavigate: (path: string) => void;
}

export function WorkExperienceGroup({
  workExperience,
  searchTerm,
  searchOptions,
  onSelect,
  onNavigate,
}: WorkExperienceGroupProps) {
  if (workExperience.length === 0) return null;

  return (
    <>
      <CommandGroup heading="Work Experience" forceMount>
        {workExperience.map((work) => (
          <CommandItem
            key={work.id}
            value={`${work.title} ${work.company}`}
            forceMount
            onSelect={() => onSelect(() => onNavigate("/#work"))}
          >
            <Briefcase className="h-4 w-4 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{work.title}</span>
              </div>
              <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {work.company} / {work.date}
              </span>
              {work.context && (
                <span
                  className="mt-0.5 block max-w-full truncate text-xs text-muted-foreground/70"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(
                      work.context,
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
