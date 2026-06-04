'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from '@/components/motion';

const SCROLL_KEY = 'portfolio-scroll-pos';
const CROSSFADE = { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };

type PageTransitionProps = {
    children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();
    const prevPathRef = useRef(pathname);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        const saveScroll = () => {
            sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ path: pathname, y: window.scrollY }));
        };

        window.addEventListener('beforeunload', saveScroll);
        return () => {
            saveScroll();
            window.removeEventListener('beforeunload', saveScroll);
        };
    }, [pathname]);

    useEffect(() => {
        const onPopState = () => {
            const raw = sessionStorage.getItem(SCROLL_KEY);
            if (!raw) return;

            const data = JSON.parse(raw) as { path?: string; y?: number };
            const y = data.y;
            if (data.path !== window.location.pathname || typeof y !== 'number') return;

            requestAnimationFrame(() => {
                window.scrollTo(0, y);
                window.lenis?.scrollTo(y, { immediate: true });
            });
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        if (prevPathRef.current !== pathname) {
            window.scrollTo(0, 0);
            window.lenis?.scrollTo(0, { immediate: true });
            prevPathRef.current = pathname;
        }
    }, [pathname]);

    if (prefersReducedMotion) {
        return <LayoutGroup>{children}</LayoutGroup>;
    }

    return (
        <LayoutGroup>
            <AnimatePresence mode="sync" initial={false}>
                <m.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={CROSSFADE}
                >
                    {children}
                </m.div>
            </AnimatePresence>
        </LayoutGroup>
    );
}
