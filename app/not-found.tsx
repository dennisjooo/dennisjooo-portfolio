'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import {
    GlitchText,
    MatrixRainBackground,
    TerminalPrompt,
} from '@/components/not-found';
import { ERROR_MESSAGES } from '@/lib/constants/notFound';

export default function NotFound() {
    const [messageIndex, setMessageIndex] = useState(0);

    const shuffledMessages = useMemo(() => {
        return [...ERROR_MESSAGES].sort(() => Math.random() - 0.5);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % shuffledMessages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [shuffledMessages.length]);

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <MatrixRainBackground />

            <motion.div
                className="relative z-10 flex flex-col items-center text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Giant 404 with glitch effect */}
                <motion.h1
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <GlitchText>404</GlitchText>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-xl md:text-2xl text-muted-foreground mt-2 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Page not found in this dimension
                </motion.p>

                {/* Terminal with rotating error messages */}
                <motion.div
                    className="w-full max-w-md mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <TerminalPrompt message={shuffledMessages[messageIndex]} />
                </motion.div>

                {/* Go Home Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-accent text-accent-foreground font-medium transition-all duration-300 hover:shadow-accent hover:scale-105"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        Return to Safety
                    </Link>
                </motion.div>

                {/* Fun footer message */}
                <motion.p
                    className="mt-12 text-sm text-muted-foreground/60 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    // TODO: fix this page... eventually
                </motion.p>
            </motion.div>
        </main>
    );
}
