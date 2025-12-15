'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MATRIX_CHARS } from '@/lib/constants/notFound';

interface MatrixColumn {
    chars: string[];
    x: number;
    delay: number;
    duration: number;
}

// Performance-optimized settings based on device
const MOBILE_BREAKPOINT = 768;
const DESKTOP_COLUMNS = 20;
const MOBILE_COLUMNS = 8;
const DESKTOP_CHARS = 15;
const MOBILE_CHARS = 8;

export function MatrixRainBackground() {
    const [columns, setColumns] = useState<MatrixColumn[]>([]);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Detect reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Generate columns based on screen size
    useEffect(() => {
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const columnCount = isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS;
        const charCount = isMobile ? MOBILE_CHARS : DESKTOP_CHARS;

        const generateColumn = (x: number): MatrixColumn => ({
            chars: Array.from({ length: charCount }, () =>
                MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
            ),
            x,
            delay: Math.random() * 5,
            duration: isMobile ? 5 + Math.random() * 3 : 3 + Math.random() * 4,
        });

        const cols = Array.from({ length: columnCount }, (_, i) =>
            generateColumn((i / columnCount) * 100)
        );
        setColumns(cols);
    }, []);

    // Don't render if user prefers reduced motion
    if (prefersReducedMotion) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-40"
            style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            }}
            aria-hidden="true"
        >
            {columns.map((col, i) => (
                <motion.div
                    key={i}
                    className="absolute top-0 text-[10px] font-mono leading-tight"
                    style={{
                        left: `${col.x}%`,
                        color: 'hsl(var(--accent))',
                    }}
                    initial={{ y: '-100%' }}
                    animate={{ y: '100vh' }}
                    transition={{
                        duration: col.duration,
                        repeat: Infinity,
                        delay: col.delay,
                        ease: 'linear',
                    }}
                >
                    {col.chars.map((char, j) => (
                        <div key={j} className="opacity-70">{char}</div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
}
