"use client";

import { CommandDialog, CommandInput } from "@/components/ui/command";
import { useCommandPalette } from "@/lib/hooks/nav/useCommandPalette";
import { shouldShowEasterEggProgress } from "@/lib/easter-eggs/search";
import type { ContactLinkData } from "@/lib/types/contacts";
import { SearchOptionsBar } from "./groups/SearchOptionsBar";
import { CommandPaletteList } from "./CommandPaletteList";
import { useCommandPaletteNavigation } from "./useCommandPaletteNavigation";

interface CommandPaletteProps {
  contacts?: ContactLinkData[];
}

export function CommandPalette({ contacts }: CommandPaletteProps) {
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
    runSecretCommand,
    pendingSecretsFocus,
    clearPendingSecretsFocus,
    copyUrl,
    router,
  } = useCommandPalette();

  const handleNavigate = useCommandPaletteNavigation(router);

  const showEasterEggProgress = shouldShowEasterEggProgress(
    search,
    matchedSecrets.length,
  );

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

      <CommandPaletteList
        open={open}
        search={search}
        copied={copied}
        exactMatch={exactMatch}
        caseSensitive={caseSensitive}
        filteredProjects={filteredProjects}
        filteredWorkExperience={filteredWorkExperience}
        matchedSecrets={matchedSecrets}
        showEasterEggProgress={showEasterEggProgress}
        pendingSecretsFocus={pendingSecretsFocus}
        clearPendingSecretsFocus={clearPendingSecretsFocus}
        contacts={contacts}
        onCopyUrl={copyUrl}
        onSelect={runCommand}
        onSecretSelect={runSecretCommand}
        onNavigate={handleNavigate}
      />
    </CommandDialog>
  );
}
