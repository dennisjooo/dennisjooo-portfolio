"use client";

import { CaseSensitive, WholeWord, FolderSearch, Briefcase, FolderGit2 } from "lucide-react";
import type { SearchScope } from "@/lib/hooks/useCommandPalette";
import { cn } from "@/lib/utils";

interface SearchOptionsBarProps {
    show: boolean;
    exactMatch: boolean;
    onToggleExactMatch: () => void;
    caseSensitive: boolean;
    onToggleCaseSensitive: () => void;
    searchScope: SearchScope;
    onChangeScope: (scope: SearchScope) => void;
}

const variantStyles = {
    option: {
        base: "px-2.5",
        active: "bg-accent/20 text-accent ring-1 ring-accent/30",
    },
    scope: {
        base: "px-2",
        active: "bg-primary text-primary-foreground shadow-sm",
    },
} as const;

function SearchOptionButton({
    active,
    onClick,
    icon: Icon,
    label,
    title,
    variant = "option",
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    title: string;
    variant?: keyof typeof variantStyles;
}) {
    const { base, active: activeStyle } = variantStyles[variant];
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "flex items-center gap-1.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-200",
                base,
                active
                    ? activeStyle
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className="h-3 w-3" />
            <span>{label}</span>
        </button>
    );
}

export function SearchOptionsBar({
    show,
    exactMatch,
    onToggleExactMatch,
    caseSensitive,
    onToggleCaseSensitive,
    searchScope,
    onChangeScope,
}: SearchOptionsBarProps) {
    if (!show) return null;

    return (
        <div className="flex flex-col border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground flex-wrap">
                {/* Match options */}
                <div className="flex items-center gap-1.5">
                    <SearchOptionButton
                        active={caseSensitive}
                        onClick={onToggleCaseSensitive}
                        icon={CaseSensitive}
                        label="Aa"
                        title="Case Sensitive"
                    />
                    <SearchOptionButton
                        active={exactMatch}
                        onClick={onToggleExactMatch}
                        icon={WholeWord}
                        label="Word"
                        title="Match Whole Word"
                    />
                </div>

                <div className="h-4 w-px bg-border/50" />

                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80 mr-1">Scope:</span>
                    <SearchOptionButton
                        variant="scope"
                        active={searchScope === "all"}
                        onClick={() => onChangeScope("all")}
                        icon={FolderSearch}
                        label="All"
                        title="Search in all"
                    />
                    <SearchOptionButton
                        variant="scope"
                        active={searchScope === "projects"}
                        onClick={() => onChangeScope("projects")}
                        icon={FolderGit2}
                        label="Projects"
                        title="Search in projects only"
                    />
                    <SearchOptionButton
                        variant="scope"
                        active={searchScope === "work"}
                        onClick={() => onChangeScope("work")}
                        icon={Briefcase}
                        label="Work"
                        title="Search in work experience only"
                    />
                </div>
            </div>
        </div>
    );
}
