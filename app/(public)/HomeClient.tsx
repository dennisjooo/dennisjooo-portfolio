'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { forceScrollToTop } from '@/lib/utils/scrollHelpers';

interface HomeClientProps {
    heroContent: ReactNode;
    mainContent: ReactNode;
    backToTop: ReactNode;
}

/**
 * Minimal client wrapper for GSAP scroll animations
 * Defers GSAP loading significantly to after LCP for better mobile performance
 */
export function HomeClient({ heroContent, mainContent, backToTop }: HomeClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    void isMobile; // Suppress unused var warning

    // Handle hash navigation after page load
    useEffect(() => {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            // Small delay to ensure content is rendered
            const scrollToHash = () => {
                // Special case for "home" - scroll to top since hero is in a sticky container
                if (hash === 'home') {
                    forceScrollToTop();
                } else {
                    const element = document.getElementById(hash);
                    if (element) {
                        // Stop Lenis temporarily to prevent interference during hash scroll
                        if (window.lenis) {
                            window.lenis.stop();
                        }
                        // First scroll to top instantly to reset scroll state
                        window.scrollTo(0, 0);
                        // Then scroll to the target element
                        requestAnimationFrame(() => {
                            element.scrollIntoView({ behavior: 'auto' });
                            // Resume Lenis after scroll completes
                            if (window.lenis) {
                                requestAnimationFrame(() => {
                                    window.lenis?.start();
                                });
                            }
                        });
                    }
                }
                // Clear hash from URL without triggering navigation
                window.history.replaceState({}, '', window.location.pathname);
            };
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                setTimeout(scrollToHash, 100);
            });
        }
    }, []);

    useEffect(() => {
        // Check if mobile
        const checkMobile = window.innerWidth < 768;
        setIsMobile(checkMobile);

        // On mobile, use simpler CSS-based approach instead of GSAP for better performance
        if (checkMobile) {
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
            {/* Sticky Hero Section - z-0 ensures it stays behind the content */}
            <div ref={heroRef} className="sticky top-0 h-screen w-full z-0">
                {heroContent}
            </div>

            {/* Main Content Stack - z-10 ensures it slides OVER the hero */}
            <div
                ref={contentRef}
                className="relative z-10 bg-white dark:bg-black shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
                {mainContent}
            </div>

            {backToTop}
        </>
    );
}
