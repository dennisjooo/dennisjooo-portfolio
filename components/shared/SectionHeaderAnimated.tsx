'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SectionHeader } from './SectionHeader';

interface SectionHeaderAnimatedProps {
    number: string;
    title: string;
    className?: string;
}

export const SectionHeaderAnimated: React.FC<SectionHeaderAnimatedProps> = (props) => {
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
        <div ref={ref}>
            <SectionHeader {...props} isVisible={isVisible} />
        </div>
    );
};
