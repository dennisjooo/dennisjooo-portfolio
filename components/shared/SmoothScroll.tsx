'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { disableScrollRestoration } from '@/lib/utils/scrollHelpers';

interface SmoothScrollProps {
    children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const isMounted = useRef(false);

    useEffect(() => {
        disableScrollRestoration();

        isMounted.current = true;

        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isMobile || prefersReducedMotion) return;

        // Defer Lenis initialization significantly to not block LCP
        // This prevents blocking the main thread during initial load
        const initLenis = async () => {
            if (!isMounted.current) return () => { };

            const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
                import('lenis'),
                import('gsap'),
                import('gsap/ScrollTrigger')
            ]);

            // Initialize Lenis with reduced options for better performance
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
            });

            // Expose Lenis globally for scroll-to-top functionality
            window.lenis = lenis;

            gsap.registerPlugin(ScrollTrigger);

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);

            // Store cleanup function
            return () => {
                lenis.destroy();
                delete window.lenis;
                gsap.ticker.remove(lenis.raf);
            };
        };

        // Use requestIdleCallback for better performance - defer until browser is idle
        let cleanup: (() => void) | undefined;

        const startInit = () => {
            initLenis().then(cleanupFn => {
                cleanup = cleanupFn;
            });
        };

        // Delay initialization significantly to let LCP complete
        // Use requestIdleCallback if available for better timing
        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(startInit, { timeout: 3000 });
            return () => {
                window.cancelIdleCallback(idleId);
                isMounted.current = false;
                cleanup?.();
            };
        } else {
            // Fallback: 1.5 second delay
            const timeoutId = setTimeout(startInit, 1500);
            return () => {
                clearTimeout(timeoutId);
                isMounted.current = false;
                cleanup?.();
            };
        }
    }, []);

    return <>{children}</>;
};
