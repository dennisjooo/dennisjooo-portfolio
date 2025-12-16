"use client";

import { FileText } from "lucide-react";
import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { highlightSearchTerm, type ProcessedProject } from "../commandPaletteUtils";

interface FilteredProject extends ProcessedProject {
    context: string | null;
}

interface ProjectsGroupProps {
    projects: FilteredProject[];
    searchTerm: string;
    onSelect: (command: () => unknown) => void;
    onNavigate: (path: string) => void;
}

export function ProjectsGroup({ projects, searchTerm, onSelect, onNavigate }: ProjectsGroupProps) {
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
                        <FileText className="mr-2 h-4 w-4 shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{project.title}</span>
                                <span className="text-[10px] text-muted-foreground opacity-50 shrink-0">
                                    {project.type}
                                </span>
                            </div>
                            {project.context && (
                                <span
                                    className="text-xs text-muted-foreground truncate max-w-full block"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightSearchTerm(project.context, searchTerm)
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
