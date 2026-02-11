'use client';

import Link from 'next/link';
import { m } from 'framer-motion';
import { useParallax } from '@/lib/hooks/useParallax';

export default function NotFound() {
    const { mounted, foreground, background } = useParallax();

    if (!mounted) return null;

    return (
        <main className="relative h-screen w-full overflow-hidden bg-background text-foreground bg-noise selection:bg-accent selection:text-accent-foreground">

            {/* 1. Abstract Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                    backgroundSize: '4rem 4rem'
                }}
            />

            {/* 2. Massive Background Typography (Parallax) */}
            <m.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
                style={{ x: background.x, y: background.y }}
            >
                <div className="relative whitespace-nowrap">
                    <h1 className="font-playfair italic text-[45vw] leading-none text-foreground/5 dark:text-foreground/10 select-none mix-blend-overlay">
                        404
                    </h1>
                    {/* Decorative overlapping geometric shape */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full border-[1px] border-foreground/5" />
                </div>
            </m.div>

            {/* 3. The "Content" Anchor - Bottom Left (Poster Style) */}
            <m.div
                className="absolute bottom-12 left-6 md:bottom-24 md:left-24 z-10 max-w-xl"
                style={{ x: foreground.x, y: foreground.y }}
            >
                <div className="flex flex-col gap-6">
                    <m.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="font-sans font-black text-7xl md:text-9xl tracking-tighter leading-[0.85] mb-4">
                            LOST<br />
                            <span className="text-accent">VOID</span>
                        </h2>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="pl-2 border-l-2 border-accent/30"
                    >
                        <p className="font-mono text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
                            // ERROR_404: The requested trajectory has led to a null reference.
                            The page you are looking for has been moved, deleted, or consumed by the void.
                        </p>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            href="/"
                            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background rounded-full overflow-hidden transition-all hover:scale-105"
                        >
                            <span className="relative z-10 font-bold tracking-widest uppercase text-sm">
                                Return to Base
                            </span>
                            <div className="absolute inset-0 bg-accent transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        </Link>
                    </m.div>
                </div>
            </m.div>

            {/* 4. Technical Specs - Top Right (Editorial Balance) */}
            <m.div
                className="absolute top-28 right-6 md:top-32 md:right-12 z-10 text-right hidden md:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
            >
                <div className="flex flex-col gap-2 font-mono text-[10px] md:text-xs text-muted-foreground/80 uppercase tracking-[0.2em]">
                    <div className="flex items-center justify-end gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>System Critical</span>
                    </div>
                    <span>ERR_CODE: 0x404</span>
                    <span>LOC: UNKNOWN_SECTOR</span>
                    <span>MEM: NULL_POINTER</span>
                </div>
            </m.div>

            {/* 5. Decorative "Peel" Line or Bar */}
            <div className="absolute bottom-0 right-12 w-px h-32 bg-gradient-to-t from-foreground/20 to-transparent hidden md:block" />
            <div className="absolute top-0 left-12 w-px h-32 bg-gradient-to-b from-foreground/20 to-transparent hidden md:block" />

        </main>
    );
}
