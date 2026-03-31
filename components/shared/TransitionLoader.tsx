'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { m } from '@/components/motion';

export function TransitionLoader() {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const DURATION = 400;

    useEffect(() => {
        setIsVisible(true);
        setProgress(0);
        startTimeRef.current = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTimeRef.current;
            const p = Math.min((elapsed / DURATION) * 100, 100);
            setProgress(p);

            if (p < 100) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                timerRef.current = setTimeout(() => {
                    setIsVisible(false);
                }, 150);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px]">
            <m.div
                className="h-full bg-gradient-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0 }}
            />
        </div>
    );
}
