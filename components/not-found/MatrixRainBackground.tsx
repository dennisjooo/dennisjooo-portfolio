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

export function MatrixRainBackground() {
    const [columns, setColumns] = useState<MatrixColumn[]>([]);

    useEffect(() => {
        const generateColumn = (x: number): MatrixColumn => ({
            chars: Array.from({ length: 20 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
            x,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        });

        const cols = Array.from({ length: 30 }, (_, i) => generateColumn((i / 30) * 100));
        setColumns(cols);
    }, []);

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-50"
            style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
            }}
        >
            {columns.map((col, i) => (
                <motion.div
                    key={i}
                    className="absolute top-0 text-[10px] font-mono leading-tight matrix-column"
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
