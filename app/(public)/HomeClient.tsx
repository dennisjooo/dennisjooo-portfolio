'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { scrollToSection } from '@/lib/utils/scrollHelpers';

interface HomeClientProps {
    heroContent: ReactNode;
    mainContent: ReactNode;
    backToTop: ReactNode;
}

export function HomeClient({ heroContent, mainContent, backToTop }: HomeClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const initialHash = typeof window !== 'undefined' ? window.location.hash : '';
    const [isReady, setIsReady] = useState(initialHash === '' || initialHash === '#home');

    useEffect(() => {
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        const isHashNav = hash !== '' && hash !== 'home';

        if (hash) {
            window.history.replaceState({}, '', window.location.pathname);
        }

        if (!isHashNav) {
            if (hash === 'home') {
                if (window.lenis) {
                    window.lenis.stop();
                }
                window.scrollTo(0, 0);
                requestAnimationFrame(() => {
                    window.scrollTo(0, 0);
                    if (window.lenis) {
                        window.lenis.scrollTo(0, { immediate: true });
                        requestAnimationFrame(() => { window.lenis?.start(); });
                    }
                });
            }
            setIsReady(true);
            return;
        }

        setIsReady(false);
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollToSection(hash);
                setIsReady(true);
            }, 50);
        });
    }, []);

    useEffect(() => {
        // Check if mobile
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Mobile: Skip GSAP animations entirely - CSS handles the sticky behavior
            return;
        }

        // Desktop: Initialize GSAP animations after a delay
        const initAnimations = async () => {
            const [gsap, { ScrollTrigger }] = await Promise.all([
                import('gsap').then(m => m.default),
                import('gsap/ScrollTrigger')
            ]);

            gsap.registerPlugin(ScrollTrigger);

            // Desktop: Full visual effect with blur
            gsap.to(heroRef.current, {
                scale: 0.95,
                opacity: 0.8,
                filter: "blur(5px)",
                ease: "none",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 100%",
                    end: "top 0%",
                    scrub: true,
                }
            });

            return () => ScrollTrigger.killAll();
        };

        // Use requestIdleCallback for better performance - longer timeout on desktop is fine
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => initAnimations(), { timeout: 2000 });
            return () => window.cancelIdleCallback(id);
        } else {
            const timer = setTimeout(initAnimations, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <>
            <div ref={heroRef} className="sticky top-0 h-screen w-full z-0" style={{ visibility: isReady ? 'visible' : 'hidden' }}>
                {heroContent}
            </div>

            <div
                ref={contentRef}
                className="relative z-10 bg-white dark:bg-black shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                style={{ visibility: isReady ? 'visible' : 'hidden' }}
            >
                {mainContent}
            </div>

            {backToTop}
        </>
    );
}
