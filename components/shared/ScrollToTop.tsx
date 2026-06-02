'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { scrollToTopWithRefresh } from '@/lib/utils/scrollHelpers';

export const ScrollToTop = () => {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            window.scrollTo(0, 0);

            const timeoutId = setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, []);

    useEffect(() => {
        if (prevPathname.current !== null && prevPathname.current !== pathname) {
            const hasHash = typeof window !== 'undefined' && window.location.hash;
            if (!hasHash) {
                scrollToTopWithRefresh();

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
