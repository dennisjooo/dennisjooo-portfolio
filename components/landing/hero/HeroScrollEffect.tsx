'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Tracks scroll position and updates body class for navbar styling
 * Minimal client component - just handles scroll state
 */
export function HeroScrollEffect() {
    const rafId = useRef<number | null>(null);
    const lastScrollY = useRef(0);

    const updateScrollState = useCallback(() => {
        // Check if we're in the hero section (first viewport)
        const heroBottom = window.innerHeight;
        const isHeroSection = lastScrollY.current < heroBottom;
        document.body.classList.toggle('is-hero-section', isHeroSection);
        rafId.current = null;
    }, []);

    useEffect(() => {
        // Set initial state
        updateScrollState();

        const handleScroll = () => {
            lastScrollY.current = window.scrollY;

            // Throttle to once per frame for better performance
            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(updateScrollState);
            }
        };

        // Passive listener for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [updateScrollState]);

    // This component renders nothing - it just manages scroll state
    return null;
}
