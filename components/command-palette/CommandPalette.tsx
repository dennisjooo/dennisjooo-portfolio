"use client";

import { SearchX } from "lucide-react";
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
                placeholder="Search commands, projects, or work..."
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

            <CommandList className="max-h-[340px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50 hover:scrollbar-thumb-muted-foreground/30 pb-2">
                {/* No results message */}
                {search.trim() && !hasSearchResults && (
                    <div className="py-10 text-center">
                        <SearchX className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">No results found</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                            Try adjusting your search or filters
                        </p>
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
