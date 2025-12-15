'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MATRIX_CHARS, MATRIX_RAIN_CONFIG } from '@/lib/constants/notFound';
import { MOBILE_BREAKPOINT } from '@/lib/constants/performance';

interface MatrixColumn {
    chars: string[];
    x: number;
    delay: number;
    duration: number;
}

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
        const config = isMobile ? MATRIX_RAIN_CONFIG.mobile : MATRIX_RAIN_CONFIG.desktop;

        const generateColumn = (x: number): MatrixColumn => ({
            chars: Array.from({ length: config.charsPerColumn }, () =>
                MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
            ),
            x,
            delay: Math.random() * 5,
            duration: config.minDuration + Math.random() * (config.maxDuration - config.minDuration),
        });

        const cols = Array.from({ length: config.columns }, (_, i) =>
            generateColumn((i / config.columns) * 100)
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
