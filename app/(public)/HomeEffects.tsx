'use client';

import { useEffect } from 'react';
import {
    clearPendingSectionScroll,
    resolveSectionScrollTarget,
    scrollToSectionWhenReady,
} from '@/lib/utils/scrollHelpers';

function setHomeVisibility(isVisible: boolean) {
    const visibility = isVisible ? 'visible' : 'hidden';
    const hero = document.getElementById('home-hero');
    const content = document.getElementById('home-content');

    if (hero) hero.style.visibility = visibility;
    if (content) content.style.visibility = visibility;
}

export function HomeEffects() {
    useEffect(() => {
        const sectionId = resolveSectionScrollTarget();
        const isHashNav = sectionId !== '' && sectionId !== 'home';

        if (!isHashNav) {
            if (sectionId === 'home' || window.location.hash === '#home') {
                if (window.lenis) {
                    window.lenis.stop();
                }
                window.scrollTo(0, 0);
                requestAnimationFrame(() => {
                    window.scrollTo(0, 0);
                    if (window.lenis) {
                        window.lenis.scrollTo(0, { immediate: true });
                        requestAnimationFrame(() => {
                            window.lenis?.start();
                        });
                    }
                });
            }
            clearPendingSectionScroll();
            setHomeVisibility(true);
            return;
        }

        setHomeVisibility(false);

        void (async () => {
            await scrollToSectionWhenReady(sectionId);
            setHomeVisibility(true);

            setTimeout(() => {
                clearPendingSectionScroll();
                window.history.replaceState({}, '', window.location.pathname);
            }, 150);
        })();
    }, []);

    useEffect(() => {
        const win = window as Window & {
            requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
            cancelIdleCallback?: (handle: number) => void;
        };

        const heroElement =
            document.getElementById('home-hero-foreground') ??
            document.getElementById('home-hero');
        const contentElement = document.getElementById('home-content');
        if (!heroElement || !contentElement) return;

        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isMobile || prefersReducedMotion) return;

        let dispose: (() => void) | undefined;
        const initAnimations = async () => {
            const [gsap, { ScrollTrigger }] = await Promise.all([
                import('gsap').then((m) => m.default),
                import('gsap/ScrollTrigger'),
            ]);

            gsap.registerPlugin(ScrollTrigger);

            const tween = gsap.to(heroElement, {
                scale: 0.95,
                opacity: 0.8,
                filter: 'blur(5px)',
                ease: 'none',
                scrollTrigger: {
                    trigger: contentElement,
                    start: 'top 100%',
                    end: 'top 0%',
                    scrub: true,
                },
            });

            dispose = () => {
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        };

        if (typeof win.requestIdleCallback === 'function') {
            const id = win.requestIdleCallback(() => {
                initAnimations();
            }, { timeout: 2000 });
            return () => {
                win.cancelIdleCallback?.(id);
                dispose?.();
            };
        }

        const timer = setTimeout(() => {
            initAnimations();
        }, 1000);
        return () => {
            clearTimeout(timer);
            dispose?.();
        };
    }, []);

    return null;
}
