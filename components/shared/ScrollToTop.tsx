'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isSectionNavigationPending, scrollToTopWithRefresh } from '@/lib/utils/scrollHelpers';

export const ScrollToTop = () => {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            if (isSectionNavigationPending()) return;

            window.scrollTo(0, 0);

            const timeoutId = setTimeout(() => {
                if (!isSectionNavigationPending()) {
                    window.scrollTo(0, 0);
                }
            }, 100);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, []);

    useEffect(() => {
        if (prevPathname.current !== null && prevPathname.current !== pathname) {
            if (!isSectionNavigationPending()) {
                scrollToTopWithRefresh();

                const timeoutId = setTimeout(() => {
                    if (!isSectionNavigationPending()) {
                        scrollToTopWithRefresh();
                    }
                }, 100);

                return () => {
                    clearTimeout(timeoutId);
                };
            }
        }
        prevPathname.current = pathname;
    }, [pathname]);

    return null;
};
