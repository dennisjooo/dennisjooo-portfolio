'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';

const Iridescence = dynamic(() => import('./Iridescence/Iridescence').then(mod => mod.default), {
    ssr: false,
    loading: () => null // No loading state needed - background is already styled
});

/**
 * Hero background with WebGL iridescence effect
 * Deferred loading to not block LCP
 * 
 * Transition flow:
 * 1. Hero shows static bg-gradient-primary
 * 2. After LCP, Iridescence loads (no fallback gradient - transparent)
 * 3. WebGL canvas fades in smoothly over the static gradient
 */
export function HeroBackground() {
    const { theme, systemTheme } = useTheme();
    const [showIridescence, setShowIridescence] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Wait for LCP to complete before loading heavy WebGL
        // Using longer delay and requestIdleCallback for better performance
        const timer = setTimeout(() => {
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => setShowIridescence(true), { timeout: 3000 });
            } else {
                setShowIridescence(true);
            }
        }, 1500); // 1.5 second delay to ensure LCP completes first
        
        return () => clearTimeout(timer);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = mounted && currentTheme === 'dark';

    // Light mode: white-gray with subtle purple tint
    // Dark mode: deep purple tones
    const iridescenceColor = useMemo<[number, number, number]>(() =>
        isDark ? [0.5, 0.2, 0.8] : [0.85, 0.82, 0.9],
        [isDark]);

    if (!showIridescence) return null;

    return (
        <div className="absolute inset-0 z-0">
            <Iridescence
                color={iridescenceColor}
                mouseReact={false}
                amplitude={0.5}
                speed={0.5}
                showFallbackGradient={false}
            />
        </div>
    );
}
