'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { forceScrollToTop, refreshScrollTrigger } from '@/lib/utils/scrollHelpers';

/**
 * Performs scroll to top with ScrollTrigger refresh
 */
function scrollToTopWithRefresh(): void {
    forceScrollToTop();
    requestAnimationFrame(() => {
        refreshScrollTrigger();
    });
}

export const ScrollToTop = () => {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);
    const hasInitialized = useRef(false);

    // Disable browser scroll restoration on mount and scroll to top on initial load
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // On initial mount, scroll to top immediately
        // This handles direct navigation/refresh to any page
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            // Immediate scroll
            window.scrollTo(0, 0);

            // Additional delayed attempt to catch browser scroll restoration
            const timeoutId = setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, []);

    useEffect(() => {
        // Only scroll if pathname actually changed (not on initial mount)
        if (prevPathname.current !== null && prevPathname.current !== pathname) {
            // Immediate scroll attempt
            scrollToTopWithRefresh();

            // Delayed attempt to catch any async scroll restoration
            const timeoutId = setTimeout(scrollToTopWithRefresh, 100);

            return () => {
                clearTimeout(timeoutId);
            };
        }
        prevPathname.current = pathname;
    }, [pathname]);

    return null;
};
