"use client";

import { Search } from "lucide-react";

interface CommandMenuTriggerProps {
    textColorClass: string;
    scrolled: boolean;
}

export const CommandMenuTrigger = ({ textColorClass, scrolled }: CommandMenuTriggerProps) => {
    const handleClick = () => {
        const event = new CustomEvent("openCommandPalette");
        document.dispatchEvent(event);
    };

    const BASE_CLASSES = "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer group";
    const HOVER_SCROLLED = "hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-sm";
    const HOVER_DEFAULT = "hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-sm";

    const hoverClass = scrolled ? HOVER_SCROLLED : HOVER_DEFAULT;

    return (
        <button
            onClick={handleClick}
            className={`${BASE_CLASSES} ${textColorClass} ${hoverClass}`}
            aria-label="Open command menu (Ctrl+K)"
        >
            <Search className="w-4 h-4" />
            <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted/30 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">K</span>
            </kbd>
        </button>
    );
};
