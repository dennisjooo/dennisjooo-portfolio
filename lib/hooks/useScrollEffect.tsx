import { useEffect, useRef, useCallback } from 'react';

export const useScrollEffect = (ref: React.RefObject<HTMLElement>) => {
    const rafId = useRef<number | null>(null);
    const lastScrollY = useRef(0);

    const updateScrollState = useCallback(() => {
        if (ref.current) {
            const heroBottom = ref.current.offsetTop + ref.current.offsetHeight;
            const isHeroSection = lastScrollY.current < heroBottom;
            document.body.classList.toggle('is-hero-section', isHeroSection);
        }
        rafId.current = null;
    }, [ref]);

    useEffect(() => {
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
    }, [ref, updateScrollState]);
};
