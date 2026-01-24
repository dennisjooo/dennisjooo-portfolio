'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GradientUnderlineProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    trigger?: 'visible' | 'hover';
}

const GradientUnderline: React.FC<GradientUnderlineProps> = ({
    children,
    className = '',
    delay = 0.5,
    trigger = 'visible'
}) => {
    const isHover = trigger === 'hover';
    const underlineRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isHover || !underlineRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0 }
        );

        observer.observe(underlineRef.current);

        return () => observer.disconnect();
    }, [isHover]);

    return (
        <span className={cn("relative inline-block", className)}>
            <span className="relative z-[1]">{children}</span>
            <span
                ref={underlineRef}
                className={cn(
                    "absolute left-0 right-0 bottom-0 h-1 bg-gradient-accent rounded-full drop-shadow-[0_0_10px_var(--accent-shadow)] z-0 origin-left",
                    isHover && "scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                    !isHover && (isVisible ? "animate-scale-x-in" : "scale-x-0")
                )}
                style={!isHover ? { animationDelay: `${delay}s` } : undefined}
            />
        </span>
    );
};

export default GradientUnderline;
