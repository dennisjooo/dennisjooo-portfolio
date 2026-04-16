'use client';

import { RefObject, useEffect } from 'react';
import { ContentSection } from '@/components/landing/about/contentSections';

interface UseAboutAnimationsProps {
    sectionRef: RefObject<HTMLDivElement | null>;
    containerRef: RefObject<HTMLDivElement | null>;
    contentSections: ContentSection[];
}

export const useAboutAnimations = ({
    sectionRef,
    containerRef,
    contentSections
}: UseAboutAnimationsProps) => {
    useEffect(() => {
        if (!containerRef.current || !sectionRef.current) return;

        let cleanup: (() => void) | undefined;
        let gsapLoaded = false;

        const initAnimations = async () => {
            if (gsapLoaded) return;
            gsapLoaded = true;

            const [gsap, { ScrollTrigger }] = await Promise.all([
                import('gsap').then(m => m.default),
                import('gsap/ScrollTrigger')
            ]);

            gsap.registerPlugin(ScrollTrigger);

            const mm = gsap.matchMedia();

            // Mobile Animation (Horizontal Scroll)
            mm.add("(max-width: 767px)", () => {
                const mobileContainer = document.querySelector('.mobile-scroll-container') as HTMLElement;
                if (!mobileContainer) return;

                const totalSections = 5; // Profile + 4 content sections

                const scrollTriggerInstance = gsap.to(mobileContainer, {
                    xPercent: -(100 * (totalSections - 1) / totalSections),
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        pin: true,
                        pinSpacing: false,
                        scrub: 0.5,
                        snap: {
                            snapTo: 1 / (totalSections - 1),
                            duration: { min: 0.15, max: 0.3 },
                            ease: "power2.out",
                            inertia: false
                        },
                        end: "+=2500",
                        fastScrollEnd: true,
                        preventOverlaps: true,
                        invalidateOnRefresh: true
                    }
                });

                return () => {
                    scrollTriggerInstance.scrollTrigger?.kill();
                };
            });

            // Desktop Animation (Simplified 2D Scroll - no 3D transforms)
            mm.add("(min-width: 768px)", () => {
                const titles = gsap.utils.toArray<HTMLElement>(".about-title");
                const bodies = gsap.utils.toArray<HTMLElement>(".about-body");

                // Hide all except first using simple opacity/translate (no 3D)
                titles.forEach((title, i) => {
                    if (i !== 0) gsap.set(title, { opacity: 0, y: -30 });
                    else gsap.set(title, { opacity: 1, y: 0 });
                });
                bodies.forEach((body, i) => {
                    if (i !== 0) gsap.set(body, { opacity: 0, y: 20 });
                    else gsap.set(body, { opacity: 1, y: 0 });
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=2000",
                        pin: true,
                        pinSpacing: false,
                        scrub: 0.5,
                        anticipatePin: 1,
                    }
                });

                // Loop through sections - simplified transitions
                contentSections.forEach((_, i) => {
                    if (i === contentSections.length - 1) return;

                    const currentTitle = titles[i];
                    const nextTitle = titles[i + 1];
                    const currentBody = bodies[i];
                    const nextBody = bodies[i + 1];

                    tl.to(currentTitle, { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" }, `step-${i}`)
                        .to(currentBody, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, `step-${i}`)
                        .to(nextTitle, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, `step-${i}+=0.3`)
                        .to(nextBody, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, `step-${i}+=0.5`);

                    tl.to({}, { duration: 0.4 });
                });
            });

            cleanup = () => {
                mm.revert();
                ScrollTrigger.getAll().forEach(st => st.kill());
            };
        };

        // Lazy load GSAP only when section enters viewport
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    initAnimations();
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
            cleanup?.();
        };
    }, [sectionRef, containerRef, contentSections]);
};
