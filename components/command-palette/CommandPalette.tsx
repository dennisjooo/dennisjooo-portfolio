"use client";

import {
    CommandDialog,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import { useCommandPalette } from "@/lib/hooks/useCommandPalette";

import { NavigationGroup } from "./groups/NavigationGroup";
import { ProjectsGroup } from "./groups/ProjectsGroup";
import { WorkExperienceGroup } from "./groups/WorkExperienceGroup";
import { SocialsGroup } from "./groups/SocialsGroup";
import { UtilitiesGroup } from "./groups/UtilitiesGroup";
import { ThemeGroup } from "./groups/ThemeGroup";
import { SecretGroup } from "./groups/SecretGroup";
import { SearchOptionsBar } from "./groups/SearchOptionsBar";

export function CommandPalette() {
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
        showSecretCommand,
        filteredProjects,
        filteredWorkExperience,
        runCommand,
        copyUrl,
        router,
    } = useCommandPalette();

    const hasSearchResults = filteredProjects.length > 0 || filteredWorkExperience.length > 0;

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
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

            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/50">
                {/* No results message */}
                {search.trim() && !hasSearchResults && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No results found.
                    </div>
                )}

                <NavigationGroup
                    onSelect={runCommand}
                    onNavigate={(path) => router.push(path)}
                />

                {search.trim() && (
                    <>
                        <ProjectsGroup
                            projects={filteredProjects}
                            searchTerm={search.trim()}
                            onSelect={runCommand}
                            onNavigate={(path) => router.push(path)}
                        />
                        <WorkExperienceGroup
                            workExperience={filteredWorkExperience}
                            searchTerm={search.trim()}
                            onSelect={runCommand}
                            onNavigate={(path) => router.push(path)}
                        />
                    </>
                )}

                <SocialsGroup onSelect={runCommand} />

                <UtilitiesGroup copied={copied} onCopyUrl={copyUrl} />

                <ThemeGroup onSelect={runCommand} />

                <SecretGroup show={showSecretCommand} onSelect={runCommand} />
            </CommandList>
        </CommandDialog>
    );
}
