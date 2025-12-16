"use client";

import { CaseSensitive, WholeWord, FolderSearch, Briefcase, FolderGit2 } from "lucide-react";
import type { SearchScope } from "@/lib/hooks/useCommandPalette";

interface SearchOptionsBarProps {
    show: boolean;
    exactMatch: boolean;
    onToggleExactMatch: () => void;
    caseSensitive: boolean;
    onToggleCaseSensitive: () => void;
    searchScope: SearchScope;
    onChangeScope: (scope: SearchScope) => void;
}

function OptionButton({
    active,
    onClick,
    icon: Icon,
    label,
    title,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    title: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${active
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-muted'
                }`}
        >
            <Icon className="h-3 w-3" />
            <span>{label}</span>
        </button>
    );
}

function ScopeButton({
    active,
    onClick,
    icon: Icon,
    label,
    title,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    title: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${active
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
                }`}
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
        <div className="flex flex-col border-b">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground flex-wrap">
                {/* Match options */}
                <div className="flex items-center gap-1">
                    <OptionButton
                        active={caseSensitive}
                        onClick={onToggleCaseSensitive}
                        icon={CaseSensitive}
                        label="Aa"
                        title="Case Sensitive"
                    />
                    <OptionButton
                        active={exactMatch}
                        onClick={onToggleExactMatch}
                        icon={WholeWord}
                        label="Word"
                        title="Match Whole Word"
                    />
                </div>

                <span className="text-muted-foreground/50">|</span>

                {/* Scope filter */}
                <div className="flex items-center gap-1">
                    <span className="text-muted-foreground/70 mr-1">In:</span>
                    <ScopeButton
                        active={searchScope === "all"}
                        onClick={() => onChangeScope("all")}
                        icon={FolderSearch}
                        label="All"
                        title="Search in all"
                    />
                    <ScopeButton
                        active={searchScope === "projects"}
                        onClick={() => onChangeScope("projects")}
                        icon={FolderGit2}
                        label="Projects"
                        title="Search in projects only"
                    />
                    <ScopeButton
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
