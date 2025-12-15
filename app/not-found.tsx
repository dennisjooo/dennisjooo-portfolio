'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const ERROR_MESSAGES = [
    'git checkout sanity',
    'undefined is not a function',
    '404: Brain not found',
    'SEGFAULT: Reality not loaded',
    'npm ERR! page not found',
    'TypeError: this.page is null',
    'Connection to reality refused',
    'sudo find / -name "page"',
    'Error: Cannot read property "path"',
    'Exception: Lost in the void',
];

function GlitchText({ children }: { children: string }) {
    return (
        <span className="glitch-text relative inline-block" data-text={children}>
            {children}
        </span>
    );
}

function MatrixRainBackground() {
    const [columns, setColumns] = useState<{ chars: string[]; x: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ</>{}[];'.split('');
        const generateColumn = (x: number) => ({
            chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]),
            x,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        });

        const cols = Array.from({ length: 30 }, (_, i) => generateColumn((i / 30) * 100));
        setColumns(cols);
    }, []);

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30"
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

function TerminalPrompt({ message }: { message: string }) {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayText('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < message.length) {
                setDisplayText(message.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [message]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className="font-mono text-sm md:text-base bg-black/80 dark:bg-black/90 rounded-lg px-4 py-3 border border-[hsl(var(--accent))]/30 shadow-lg">
            <span className="text-green-400">$</span>
            <span className="text-gray-300 ml-2">{displayText}</span>
            <span className={`ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'} text-[hsl(var(--accent))]`}>▌</span>
        </div>
    );
}

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
