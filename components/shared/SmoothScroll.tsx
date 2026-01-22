'use client';

import { ReactNode, useEffect, useState } from 'react';

interface SmoothScrollProps {
    children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile - skip smooth scroll on mobile for better performance
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();

        // Don't initialize Lenis on mobile - native scroll is better for performance
        if (isMobile) return;

        // Defer Lenis initialization significantly to not block LCP
        // This prevents blocking the main thread during initial load
        const initLenis = async () => {
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

            // Sync Lenis with GSAP ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);

            lenis.on('scroll', ScrollTrigger.update);

            // Add Lenis's raf method to GSAP's ticker
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            // Disable GSAP's lag smoothing to ensure smooth scrolling
            gsap.ticker.lagSmoothing(0);

            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

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
                cleanup?.();
            };
        } else {
            // Fallback: 1.5 second delay
            const timeoutId = setTimeout(startInit, 1500);
            return () => {
                clearTimeout(timeoutId);
                cleanup?.();
            };
        }
    }, [isMobile]);

    return <>{children}</>;
};
