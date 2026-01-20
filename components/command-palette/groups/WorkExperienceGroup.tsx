"use client";

import { Briefcase } from "lucide-react";
import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { highlightSearchTerm, type ProcessedWorkExperience } from "../commandPaletteUtils";

interface FilteredWorkExperience extends ProcessedWorkExperience {
    context: string | null;
}

interface WorkExperienceGroupProps {
    workExperience: FilteredWorkExperience[];
    searchTerm: string;
    onSelect: (command: () => unknown) => void;
    onNavigate: (path: string) => void;
}

export function WorkExperienceGroup({ workExperience, searchTerm, onSelect, onNavigate }: WorkExperienceGroupProps) {
    if (workExperience.length === 0) return null;

    return (
        <>
            <CommandGroup heading="Work Experience" forceMount>
                {workExperience.map((work) => (
                    <CommandItem
                        key={work.id}
                        value={`${work.title} ${work.company}`}
                        forceMount
                        onSelect={() => onSelect(() => onNavigate('/#work'))}
                    >
                        <Briefcase className="h-4 w-4 shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{work.title}</span>
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground/80 uppercase tracking-wider truncate">
                                {work.company} / {work.date}
                            </span>
                            {work.context && (
                                <span
                                    className="text-xs text-muted-foreground/70 truncate max-w-full block mt-0.5"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightSearchTerm(work.context, searchTerm)
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
