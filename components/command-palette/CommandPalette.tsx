"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { SearchX } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useCommandPalette } from "@/lib/hooks/nav/useCommandPalette";
import {
  scrollToTop,
  scrollToSection,
  setPendingSectionScroll,
} from "@/lib/utils/scrollHelpers";

import { NavigationGroup } from "./groups/NavigationGroup";
import { ProjectsGroup } from "./groups/ProjectsGroup";
import { WorkExperienceGroup } from "./groups/WorkExperienceGroup";
import { SocialsGroup } from "./groups/SocialsGroup";
import { UtilitiesGroup } from "./groups/UtilitiesGroup";
import { ThemeGroup } from "./groups/ThemeGroup";
import { SecretGroup } from "./groups/SecretGroup";
import { SearchOptionsBar } from "./groups/SearchOptionsBar";
import type { ContactLinkData } from "@/lib/types/contacts";

interface CommandPaletteProps {
  contacts?: ContactLinkData[];
}

export function CommandPalette({ contacts }: CommandPaletteProps) {
  const pathname = usePathname() ?? "/";
  const {
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
  } = useCommandPalette();

  const handleNavigate = useCallback(
    (path: string) => {
      if (path.startsWith("/#")) {
        const sectionId = path.slice(2);
        if (pathname === "/") {
          if (sectionId === "home") {
            scrollToTop(true);
          } else {
            scrollToSection(sectionId);
          }
          return;
        }

        setPendingSectionScroll(sectionId);
      }
      router.push(path);
    },
    [pathname, router],
  );

  const hasSearchResults =
    filteredProjects.length > 0 ||
    filteredWorkExperience.length > 0 ||
    matchedSecrets.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search commands, projects, or work..."
        value={search}
        onValueChange={setSearch}
        autoFocus
      />

      <SearchOptionsBar
        show={Boolean(search.trim())}
        exactMatch={exactMatch}
        onToggleExactMatch={() => setExactMatch(!exactMatch)}
        caseSensitive={caseSensitive}
        onToggleCaseSensitive={() => setCaseSensitive(!caseSensitive)}
        searchScope={searchScope}
        onChangeScope={setSearchScope}
      />

      <CommandList className="max-h-[340px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50 hover:scrollbar-thumb-muted-foreground/30 pb-2">
        {/* No results message */}
        {search.trim() && !hasSearchResults && (
          <div className="py-10 text-center">
            <SearchX className="mx-auto h-8 w-8 text-muted-foreground/70 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No results found
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1 font-mono">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        <NavigationGroup onSelect={runCommand} onNavigate={handleNavigate} />

        {search.trim() && (
          <>
            <ProjectsGroup
              projects={filteredProjects}
              searchTerm={search.trim()}
              searchOptions={{ caseSensitive, exactMatch }}
              onSelect={runCommand}
              onNavigate={handleNavigate}
            />
            <WorkExperienceGroup
              workExperience={filteredWorkExperience}
              searchTerm={search.trim()}
              searchOptions={{ caseSensitive, exactMatch }}
              onSelect={runCommand}
              onNavigate={handleNavigate}
            />
          </>
        )}

        <SocialsGroup contacts={contacts} onSelect={runCommand} />

        <UtilitiesGroup copied={copied} onCopyUrl={copyUrl} />

        <ThemeGroup onSelect={runCommand} />

        <SecretGroup secrets={matchedSecrets} onSelect={runCommand} />
      </CommandList>
    </CommandDialog>
  );
}
