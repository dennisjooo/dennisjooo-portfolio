'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ScrollRestorationConfig {
    pathname: string;
    initDelay?: number;
    throttleMs?: number;
}

export function useScrollRestoration(config: ScrollRestorationConfig): void {
    const { pathname, initDelay = 1000, throttleMs = 100 } = config;
    const isRestoring = useRef(false);

    useIsomorphicLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const restoreScroll = () => {
            // Check for hash link first - deep linking takes priority
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);

                const scrollToElement = (retries = 0) => {
                    const element = document.getElementById(hash);
                    if (element) {
                        isRestoring.current = true;
                        element.scrollIntoView({ behavior: 'instant' });
                        setTimeout(() => {
                            isRestoring.current = false;
                        }, 100);
                    } else if (retries < 10) {
                        setTimeout(() => scrollToElement(retries + 1), 50);
                    }
                };

                requestAnimationFrame(() => {
                    scrollToElement();
                });
                return;
            }

            const key = `scroll-pos-${pathname}`;
            const savedPos = sessionStorage.getItem(key);

            if (savedPos !== null) {
                const y = parseInt(savedPos, 10);
                isRestoring.current = true;
                window.scrollTo(0, y);
                setTimeout(() => {
                    window.scrollTo(0, y);
                    isRestoring.current = false;
                }, 0);
            }
        };

        restoreScroll();

        const handleScroll = () => {
            if (isRestoring.current) return;
            const key = `scroll-pos-${pathname}`;
            sessionStorage.setItem(key, window.scrollY.toString());
        };

        let timeoutId: NodeJS.Timeout | null = null;
        const throttledScroll = () => {
            if (isRestoring.current) return;
            if (timeoutId) return;

            timeoutId = setTimeout(() => {
                handleScroll();
                timeoutId = null;
            }, throttleMs);
        };

        const initTimeout = setTimeout(() => {
            window.addEventListener('scroll', throttledScroll);
        }, initDelay);

        return () => {
            clearTimeout(initTimeout);
            window.removeEventListener('scroll', throttledScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [pathname, initDelay, throttleMs]);
}
