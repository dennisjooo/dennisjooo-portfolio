'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { GradientUnderline } from '@/components/shared';

export const ViewAllButton = () => {
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
        <div
            ref={ref}
            className="w-full flex justify-center mt-20 md:mt-32 transition-all duration-[600ms] ease-out delay-[400ms]"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            }}
        >
            <Link
                href="/blogs"
                prefetch
                className="group relative inline-flex items-center gap-3 py-2"
            >
                <GradientUnderline trigger="hover" className="font-urbanist font-bold text-lg md:text-xl uppercase tracking-widest text-foreground transition-colors duration-300 group-hover:text-accent">
                    All Projects
                </GradientUnderline>
                
                <ArrowRightIcon className="w-5 h-5 text-foreground transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent" />
            </Link>
        </div>
    );
};
