'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { m, useReducedMotion } from '@/components/motion';

export function RouteProgressBar() {
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();
    const isFirstRender = useRef(true);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const rafRef = useRef<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (prefersReducedMotion) return;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setVisible(true);
        setProgress(0);
        const start = performance.now();
        const duration = 280;

        const tick = (now: number) => {
            const p = Math.min(((now - start) / duration) * 100, 100);
            setProgress(p);
            if (p < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                timerRef.current = setTimeout(() => setVisible(false), 100);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname, prefersReducedMotion]);

    if (prefersReducedMotion || !visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
            <m.div
                className="h-full bg-gradient-accent"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
