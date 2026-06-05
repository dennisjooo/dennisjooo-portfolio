'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { m, useReducedMotion } from '@/components/motion';
import { Loader } from './Loader';

const FIRST_VISIT_KEY = 'portfolio-has-visited';
const INITIAL_MIN_MS = 1200;

function getHasVisited() {
    return (
        typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem(FIRST_VISIT_KEY) === 'true'
    );
}

type LoadingProviderProps = {
    children: ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
    const prefersReducedMotion = useReducedMotion();
    const hasVisitedOnMount = getHasVisited();

    const [showInitialLoader, setShowInitialLoader] = useState(!hasVisitedOnMount);
    const [contentReady, setContentReady] = useState(hasVisitedOnMount);

    const [progress, setProgress] = useState(0);
    const didRevealRef = useRef(false);
    const rafRef = useRef<number | null>(null);

    const revealContent = useCallback(() => {
        setShowInitialLoader(false);
        sessionStorage.setItem(FIRST_VISIT_KEY, 'true');

        if (didRevealRef.current) return;
        didRevealRef.current = true;

        requestAnimationFrame(() => {
            setContentReady(true);
            window.dispatchEvent(new Event('portfolio:content-revealed'));
        });
    }, []);

    const runProgress = useCallback((durationMs: number, onDone: () => void) => {
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const p = Math.min((elapsed / durationMs) * 100, 100);
            setProgress(p);

            if (p < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                onDone();
            }
        };

        setProgress(0);
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) {
            revealContent();
            return;
        }

        if (hasVisitedOnMount) {
            setShowInitialLoader(false);
            setContentReady(true);
            didRevealRef.current = true;
            window.dispatchEvent(new Event('portfolio:content-revealed'));
            return;
        }

        runProgress(INITIAL_MIN_MS, revealContent);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [hasVisitedOnMount, prefersReducedMotion, revealContent, runProgress]);

    useEffect(() => {
        if (!showInitialLoader) return;

        const htmlEl = document.documentElement;
        const bodyEl = document.body;

        const originalHtmlOverflow = htmlEl.style.overflow;
        const originalBodyOverflow = bodyEl.style.overflow;

        htmlEl.style.overflow = 'hidden';
        bodyEl.style.overflow = 'hidden';

        if (window.lenis) {
            window.lenis.stop();
        }

        const handleLenisReady = () => {
            if (window.lenis) {
                window.lenis.stop();
            }
        };

        window.addEventListener('portfolio:lenis-ready', handleLenisReady);

        return () => {
            htmlEl.style.overflow = originalHtmlOverflow;
            bodyEl.style.overflow = originalBodyOverflow;
            window.removeEventListener('portfolio:lenis-ready', handleLenisReady);
            if (window.lenis) {
                window.lenis.start();
            }
        };
    }, [showInitialLoader]);

    return (
        <>
            <Loader visible={showInitialLoader} progress={progress} />
            <m.div
                data-content-ready={contentReady ? 'true' : 'false'}
                initial={false}
                animate={{ opacity: contentReady ? 1 : 0 }}
                transition={{
                    duration: prefersReducedMotion ? 0 : 0.5,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                {children}
            </m.div>
        </>
    );
}
