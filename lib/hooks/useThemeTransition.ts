'use client';

import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { useMounted } from '@/lib/hooks/useMounted';

interface ThemeTransitionConfig {
    duration?: number;
}

interface ThemeTransitionResult {
    mounted: boolean;
    isDark: boolean;
    buttonRef: React.RefObject<HTMLButtonElement>;
    toggleTheme: () => Promise<void>;
}

export function useThemeTransition(config: ThemeTransitionConfig = {}): ThemeTransitionResult {
    const { duration = 400 } = config;
    const { theme, setTheme, systemTheme } = useTheme();
    const mounted = useMounted();
    const buttonRef = useRef<HTMLButtonElement>(null!);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = mounted ? currentTheme === 'dark' : false;

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;

        const newTheme = isDark ? 'light' : 'dark';

        // Check if View Transition API is supported
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            }
        );
    }, [isDark, duration, setTheme]);

    return {
        mounted,
        isDark,
        buttonRef,
        toggleTheme,
    };
}
