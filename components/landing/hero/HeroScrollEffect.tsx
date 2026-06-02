'use client';

import { useEffect, useRef, useCallback } from 'react';

export function HeroScrollEffect() {
    const rafId = useRef<number | null>(null);
    const lastScrollY = useRef(0);

    const updateScrollState = useCallback(() => {
        const heroBottom = window.innerHeight;
        const isHeroSection = lastScrollY.current < heroBottom;
        document.body.classList.toggle('is-hero-section', isHeroSection);
        rafId.current = null;
    }, []);

    useEffect(() => {
        updateScrollState();

        const handleScroll = () => {
            lastScrollY.current = window.scrollY;

            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(updateScrollState);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [updateScrollState]);

    return null;
}
