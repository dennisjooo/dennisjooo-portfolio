'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

const ScrollRestorer = () => {
    const pathname = usePathname();
    const isRestoring = useRef(false);

    // Use useLayoutEffect to prevent flash of wrong scroll position
    // We use a safe version for SSR environments (though this is a client component, it might be rendered on server initially as part of the tree)
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const restoreScroll = () => {
            // Check for hash link first - deep linking takes priority
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);

                // Try to find and scroll to element with retries
                const scrollToElement = (retries = 0) => {
                    const element = document.getElementById(hash);
                    if (element) {
                        isRestoring.current = true;
                        element.scrollIntoView({ behavior: 'instant' });
                        setTimeout(() => {
                            isRestoring.current = false;
                        }, 100);
                    } else if (retries < 10) {
                        // Retry if element not found yet (content might be rendering)
                        setTimeout(() => scrollToElement(retries + 1), 50);
                    }
                };

                // Small delay to ensure content has rendered
                requestAnimationFrame(() => {
                    scrollToElement();
                });
                return; // Skip saved position restoration when hash is present
            }

            const key = `scroll-pos-${pathname}`;
            const savedPos = sessionStorage.getItem(key);

            if (savedPos !== null) {
                const y = parseInt(savedPos, 10);
                // Instant scroll restoration
                isRestoring.current = true;
                window.scrollTo(0, y);
                // Small timeout to ensure it sticks if content loads slightly async, 
                // though for static content this should be immediate
                setTimeout(() => {
                    window.scrollTo(0, y);
                    isRestoring.current = false;
                }, 0);
            }
        };

        restoreScroll();

        // Save scroll position on scroll
        const handleScroll = () => {
            if (isRestoring.current) return;

            // Simple throttling using requestAnimationFrame or just plain storage set
            const key = `scroll-pos-${pathname}`;
            sessionStorage.setItem(key, window.scrollY.toString());
        };

        // We can use a simple throttle or debounce if needed, but modern browsers handle sessionStorage reasonably fast.
        // Let's debounce it slightly to avoid thrashing storage on every pixel
        let timeoutId: NodeJS.Timeout;
        const throttledScroll = () => {
            if (isRestoring.current) return;
            if (timeoutId) return;


            timeoutId = setTimeout(() => {
                handleScroll();
                // @ts-ignore
                timeoutId = null;
            }, 100);
        };

        // Delay attaching the scroll listener to avoid capturing initial load layout shifts/animations
        // The blog page has ~0.8s animations, so waiting 1s is safe.
        const initTimeout = setTimeout(() => {
            window.addEventListener('scroll', throttledScroll);
        }, 1000);

        return () => {
            clearTimeout(initTimeout);
            window.removeEventListener('scroll', throttledScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [pathname]);

    return null;
};

export default ScrollRestorer;
