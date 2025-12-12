"use client";

import { Command } from "lucide-react";

interface CommandMenuTriggerProps {
    textColorClass: string;
    scrolled: boolean;
}

export const CommandMenuTrigger = ({ textColorClass, scrolled }: CommandMenuTriggerProps) => {
    const handleClick = () => {
        const event = new CustomEvent("openCommandPalette");
        document.dispatchEvent(event);
    };

    const BASE_CLASSES = "hidden md:flex items-center justify-center p-2 rounded-full transition-colors duration-300 ease-in-out cursor-pointer group";
    const HOVER_SCROLLED = "hover:bg-black/5 dark:hover:bg-white/10";
    const HOVER_DEFAULT = "hover:bg-black/10 dark:hover:bg-white/10";

    const hoverClass = scrolled ? HOVER_SCROLLED : HOVER_DEFAULT;

    return (
        <button
            onClick={handleClick}
            className={`${BASE_CLASSES} ${textColorClass} ${hoverClass}`}
            aria-label="Open command menu"
        >
            <Command className="w-5 h-5" />
        </button>
    );
};
