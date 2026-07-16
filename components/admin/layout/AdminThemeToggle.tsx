"use client";

import { BsSun, BsMoon } from "react-icons/bs";
import { useThemeTransition } from "@/lib/hooks/ui/useThemeTransition";

interface AdminThemeToggleProps {
  isCollapsed: boolean;
}

export function AdminThemeToggle({ isCollapsed }: AdminThemeToggleProps) {
  const { mounted, isDark, buttonRef, toggleTheme } = useThemeTransition();
  const Icon = mounted && isDark ? BsSun : BsMoon;

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="flex w-full items-center gap-3 rounded px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span
        className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-opacity duration-200 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        {mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Theme"}
      </span>
    </button>
  );
}
