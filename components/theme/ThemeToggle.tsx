"use client";

import { BsSun, BsMoon } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { useThemeTransition } from "@/lib/hooks/ui/useThemeTransition";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  textColorClass?: string;
  scrolled?: boolean;
}

export const ThemeToggle = ({
  className,
  duration = 400,
  textColorClass = "text-foreground",
  scrolled = false,
  ...props
}: ThemeToggleProps) => {
  const { mounted, isDark, buttonRef, toggleTheme } = useThemeTransition({
    duration,
  });

  const hoverClass = scrolled
    ? "hover:bg-black/5 dark:hover:bg-white/10"
    : "hover:bg-black/10 dark:hover:bg-white/10";

  const focusClasses =
    "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300",
          focusClasses,
        )}
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
        focusClasses,
        hoverClass,
        className,
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      {...props}
    >
      <div className="relative h-5 w-5">
        {isDark ? (
          <BsSun
            className={`h-5 w-5 transition-all duration-300 ${textColorClass}`}
          />
        ) : (
          <BsMoon
            className={`h-5 w-5 transition-all duration-300 ${textColorClass}`}
          />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
