'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

    return (
        <span className={cn("relative inline-block", className)}>
            <span className="relative z-[1]">{children}</span>
            <motion.span
                className={cn(
                    "absolute left-0 right-0 bottom-0 h-1 bg-gradient-accent rounded-full drop-shadow-[0_0_10px_var(--accent-shadow)] z-0",
                    isHover && "scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                )}
                {...(!isHover ? {
                    initial: { scaleX: 0 },
                    whileInView: { scaleX: 1 },
                    viewport: { once: true },
                    transition: { duration: 0.8, delay }
                } : {})}
                style={{ transformOrigin: "left" }}
            />
        </span>
    );
};

export default GradientUnderline;
