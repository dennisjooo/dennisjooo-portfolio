'use client';

import { BsSun, BsMoon } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { useThemeTransition } from '@/lib/hooks/useThemeTransition';

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<'button'> {
    duration?: number;
    textColorClass?: string;
    scrolled?: boolean;
}

export const ThemeToggle = ({
    className,
    duration = 400,
    textColorClass = 'text-foreground',
    scrolled = false,
    ...props
}: ThemeToggleProps) => {
    const { mounted, isDark, buttonRef, toggleTheme } = useThemeTransition({ duration });

    const hoverClass = scrolled
        ? "hover:bg-black/5 dark:hover:bg-white/10"
        : "hover:bg-black/10 dark:hover:bg-white/10";

    if (!mounted) {
        return (
            <button
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Toggle theme"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className={cn(
                'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out',
                hoverClass,
                className
            )}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            {...props}
        >
            <div className="relative w-5 h-5">
                {isDark ? (
                    <BsSun className={`w-5 h-5 transition-all duration-300 ${textColorClass}`} />
                ) : (
                    <BsMoon className={`w-5 h-5 transition-all duration-300 ${textColorClass}`} />
                )}
            </div>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
