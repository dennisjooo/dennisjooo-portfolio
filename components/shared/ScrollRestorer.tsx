'use client';

import { usePathname } from 'next/navigation';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

const ScrollRestorer = () => {
    const pathname = usePathname();
    useScrollRestoration({ pathname });
    return null;
};

export default ScrollRestorer;
