'use client';

import { AnimatePresence, m } from '@/components/motion';
import { usePathname } from 'next/navigation';
import { TransitionLoader } from '@/components/shared/TransitionLoader';

function hasNavigationHash(): boolean {
    if (typeof window === 'undefined') return false;
    return window.location.hash.length > 1;
}

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            <TransitionLoader />
            <AnimatePresence mode="wait">
                <m.div
                    key={pathname}
                    initial={hasNavigationHash() ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {children}
                </m.div>
            </AnimatePresence>
        </>
    );
}
