"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
interface CommandMenuTriggerProps {
  textColorClass: string;
  scrolled: boolean;
}

export const CommandMenuTrigger = ({
  textColorClass,
}: CommandMenuTriggerProps) => {
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    const isWindows =
      typeof navigator !== "undefined" && /Windows/i.test(navigator.userAgent);
    if (isWindows) {
      setShortcut("Ctrl K");
    }
  }, []);

  const handleClick = () => {
    const event = new CustomEvent("openCommandPalette");
    document.dispatchEvent(event);
  };

  const BASE_CLASSES =
    "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm transition-colors duration-200 ease-out cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";
  const hoverClass = "hover:bg-secondary";

  return (
    <button
      onClick={handleClick}
      className={`${BASE_CLASSES} ${textColorClass} ${hoverClass}`}
      aria-label={`Open command menu (${shortcut})`}
    >
      <Search className="h-4 w-4" />
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 whitespace-nowrap rounded border bg-muted/30 px-1.5 font-mono text-xs font-medium text-muted-foreground lg:inline-flex">
        <span className="text-xs">{shortcut}</span>
      </kbd>
    </button>
  );
};
