'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const scaleX = useSpring(0, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
            setProgress(scrollPercent);
            scaleX.set(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', updateProgress);
    }, [scaleX]);

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted/30">
            <motion.div
                className="h-full origin-left bg-gradient-accent"
                style={{
                    scaleX,
                    boxShadow: progress > 0 ? '0 0 10px var(--accent-shadow)' : 'none',
                }}
            />
        </div>
    );
}
