'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { scrollToTopWithRefresh } from '@/lib/utils/scrollHelpers';

export const ScrollToTop = () => {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // On initial mount, scroll to top immediately
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
            // Skip scroll-to-top if there's a hash - let HomeClient handle hash navigation
            const hasHash = typeof window !== 'undefined' && window.location.hash;
            if (!hasHash) {
                // Immediate scroll attempt
                scrollToTopWithRefresh();

                // Delayed attempt to catch any async scroll restoration
                const timeoutId = setTimeout(scrollToTopWithRefresh, 100);

                return () => {
                    clearTimeout(timeoutId);
                };
            }
        }
        prevPathname.current = pathname;
    }, [pathname]);

    return null;
};
