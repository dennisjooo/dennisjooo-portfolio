"use client";

import { useEffect, useRef } from "react";
import { SearchX } from "lucide-react";
import { CommandList } from "@/components/ui/command";
import type {
  FilteredProject,
  FilteredWorkExperience,
} from "@/lib/hooks/nav/useCommandPalette";
import type { SecretDefinition } from "@/lib/easter-eggs/types";
import type { ContactLinkData } from "@/lib/types/contacts";
import { NavigationGroup } from "./groups/NavigationGroup";
import { ProjectsGroup } from "./groups/ProjectsGroup";
import { WorkExperienceGroup } from "./groups/WorkExperienceGroup";
import { SocialsGroup } from "./groups/SocialsGroup";
import { UtilitiesGroup } from "./groups/UtilitiesGroup";
import { ThemeGroup } from "./groups/ThemeGroup";
import { SecretGroup } from "./groups/SecretGroup";
import { EasterEggProgressGroup } from "./groups/EasterEggProgressGroup";

interface CommandPaletteListProps {
  open: boolean;
  search: string;
  copied: boolean;
  exactMatch: boolean;
  caseSensitive: boolean;
  filteredProjects: FilteredProject[];
  filteredWorkExperience: FilteredWorkExperience[];
  matchedSecrets: SecretDefinition[];
  showEasterEggProgress: boolean;
  pendingSecretsFocus: boolean;
  clearPendingSecretsFocus: () => void;
  contacts?: ContactLinkData[];
  onCopyUrl: () => void;
  onSelect: (command: () => unknown) => void;
  onSecretSelect: (command: () => unknown, closePalette?: boolean) => void;
  onNavigate: (path: string) => void;
}

export function CommandPaletteList({
  open,
  search,
  copied,
  exactMatch,
  caseSensitive,
  filteredProjects,
  filteredWorkExperience,
  matchedSecrets,
  showEasterEggProgress,
  pendingSecretsFocus,
  clearPendingSecretsFocus,
  contacts,
  onCopyUrl,
  onSelect,
  onSecretSelect,
  onNavigate,
}: CommandPaletteListProps) {
  const secretsSectionRef = useRef<HTMLDivElement>(null);
  const searchTerm = search.trim();
  const searchOptions = { caseSensitive, exactMatch };

  const hasSearchResults =
    filteredProjects.length > 0 ||
    filteredWorkExperience.length > 0 ||
    matchedSecrets.length > 0 ||
    showEasterEggProgress;

  useEffect(() => {
    if (!open || !pendingSecretsFocus || !showEasterEggProgress) return;

    const timeout = window.setTimeout(() => {
      secretsSectionRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
      clearPendingSecretsFocus();
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [
    open,
    pendingSecretsFocus,
    showEasterEggProgress,
    clearPendingSecretsFocus,
  ]);

  return (
    <CommandList className="max-h-[340px] overflow-y-auto overflow-x-hidden pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50 hover:scrollbar-thumb-muted-foreground/30">
      {searchTerm && !hasSearchResults && (
        <div className="py-10 text-center">
          <SearchX className="mx-auto mb-3 h-8 w-8 text-muted-foreground/70" />
          <p className="text-sm font-medium text-muted-foreground">
            No results found
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground/80">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      <NavigationGroup onSelect={onSelect} onNavigate={onNavigate} />

      {searchTerm && (
        <>
          <ProjectsGroup
            projects={filteredProjects}
            searchTerm={searchTerm}
            searchOptions={searchOptions}
            onSelect={onSelect}
            onNavigate={onNavigate}
          />
          <WorkExperienceGroup
            workExperience={filteredWorkExperience}
            searchTerm={searchTerm}
            searchOptions={searchOptions}
            onSelect={onSelect}
            onNavigate={onNavigate}
          />
        </>
      )}

      <SocialsGroup contacts={contacts} onSelect={onSelect} />

      <UtilitiesGroup
        copied={copied}
        onCopyUrl={onCopyUrl}
        onSelect={onSelect}
      />

      <ThemeGroup onSelect={onSelect} />

      <SecretGroup secrets={matchedSecrets} onSelect={onSecretSelect} />

      {showEasterEggProgress ? (
        <div ref={secretsSectionRef}>
          <EasterEggProgressGroup open={open} />
        </div>
      ) : null}
    </CommandList>
  );
}
