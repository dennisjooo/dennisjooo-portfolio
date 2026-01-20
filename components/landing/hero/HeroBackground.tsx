'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
 * 2. After LCP, Iridescence component loads (container starts at opacity 0)
 * 3. Once WebGL is ready, container fades in smoothly over the static gradient
 */
export function HeroBackground() {
    const { theme, systemTheme } = useTheme();
    const [showIridescence, setShowIridescence] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Check if mobile for transition timing
        const checkMobile = window.innerWidth < 768;
        setIsMobile(checkMobile);
        
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

    // Called when WebGL has rendered its first frame
    const handleReady = useCallback(() => {
        // Add a small delay to ensure the WebGL has stabilized
        // This prevents the "pop" effect on mobile
        const delay = isMobile ? 100 : 50;
        setTimeout(() => setIsReady(true), delay);
    }, [isMobile]);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = mounted && currentTheme === 'dark';

    // Light mode: white-gray with subtle purple tint
    // Dark mode: deep purple tones
    const iridescenceColor = useMemo<[number, number, number]>(() =>
        isDark ? [0.5, 0.2, 0.8] : [0.85, 0.82, 0.9],
        [isDark]);

    if (!showIridescence) return null;

    // Use longer transition on mobile (4s) vs desktop (2s)
    // Mobile needs longer transition because there's no GSAP scroll effect to mask the change
    const transitionDuration = isMobile ? 4 : 2;

    return (
        <div 
            className="absolute inset-0 z-0 transition-opacity ease-in-out"
            style={{ 
                opacity: isReady ? 1 : 0,
                transitionDuration: `${transitionDuration}s`
            }}
        >
            <Iridescence
                color={iridescenceColor}
                mouseReact={false}
                amplitude={0.5}
                speed={0.5}
                showFallbackGradient={false}
                onReady={handleReady}
            />
        </div>
    );
}
