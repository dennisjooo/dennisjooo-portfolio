"use client";

import { Briefcase } from "lucide-react";
import { SearchResultGroup } from "./SearchResultGroup";
import {
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
  return (
    <SearchResultGroup
      heading="Work Experience"
      items={workExperience}
      searchTerm={searchTerm}
      searchOptions={searchOptions}
      icon={Briefcase}
      getKey={(work) => work.id}
      getValue={(work) => `${work.title} ${work.company}`}
      renderPrimary={(work) => work.title}
      renderSecondary={(work) => (
        <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
          {work.company} / {work.date}
        </span>
      )}
      getContext={(work) => work.context}
      onSelect={onSelect}
      onItemSelect={() => onNavigate("/#work")}
    />
  );
}
