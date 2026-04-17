'use client';

import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { TransitionLoader } from '@/components/shared/TransitionLoader';

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPathRef = useRef(pathname);

    const isNavigation = prevPathRef.current !== pathname;
    prevPathRef.current = pathname;

    return (
        <>
            {isNavigation && <TransitionLoader />}
            <div key={pathname} className={isNavigation ? 'page-transition-enter' : undefined}>
                {children}
            </div>
        </>
    );
}
