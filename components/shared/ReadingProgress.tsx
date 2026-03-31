'use client';

import { m, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted/30">
            <m.div
                className="h-full origin-left bg-gradient-accent"
                style={{
                    scaleX,
                    boxShadow: '0 0 10px var(--accent-shadow)',
                }}
            />
        </div>
    );
}
