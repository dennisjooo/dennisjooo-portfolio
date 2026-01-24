'use client';

import { useRef, useEffect, useState } from 'react';
import { SectionHeaderAnimated } from '@/components/shared/SectionHeaderAnimated';

export const FeaturedProjectsHeader = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full mb-16 md:mb-24">
            <SectionHeaderAnimated 
                number="04." 
                title="Featured Projects" 
                className="mb-12"
            />

            <div
                ref={ref}
                className="relative w-full pt-12 select-none transition-all duration-[800ms] ease-out"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                }}
            >
                <div className="flex flex-col items-start w-full">
                    <span 
                        className="font-playfair italic text-7xl md:text-9xl ml-2 md:ml-12 mb-[-3vw] md:mb-[-4vw] relative z-20 text-foreground transition-all duration-[1000ms] ease-out delay-200"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
                        }}
                    >
                        Selected
                    </span>
                    <h2 className="font-urbanist font-black text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter text-background-layer z-10 select-none">
                        WORK
                    </h2>
                </div>
            </div>
        </div>
    );
};
