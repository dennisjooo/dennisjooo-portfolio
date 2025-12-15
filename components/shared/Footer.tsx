'use client';

import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';

const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const gradientVariants = useMemo(() => ({
        hidden: { opacity: 0, scaleY: 0.15 },
        visible: { opacity: 0.7, scaleY: 1 }
    }), []);

    const textVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 }
    }), []);

    return (
        <footer ref={ref} className="relative w-full overflow-hidden">
            {/* Wrapper handles centering so Framer can animate scale without overriding transforms */}
            <div className="pointer-events-none absolute left-1/2 top-full h-[103%] w-[130%] -translate-x-1/2 -translate-y-[60%] sm:w-[140%]">
                <motion.div
                    className="h-full w-full rounded-full"
                    variants={gradientVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        transformOrigin: 'center bottom',
                        background: `radial-gradient(ellipse at center,
                            var(--gradient-accent-from) 0%,
                            var(--gradient-accent-from) 15%,
                            var(--gradient-accent-via) 40%,
                            var(--gradient-accent-to) 60%,
                            transparent 80%)`,
                        filter: 'blur(30px)',
                        backgroundImage: `radial-gradient(ellipse at center,
                            var(--gradient-accent-from) 0%,
                            var(--gradient-accent-from) 15%,
                            var(--gradient-accent-via) 40%,
                            var(--gradient-accent-to) 60%,
                            transparent 80%),
                            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
                    }}
                />
            </div>
            <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-8 pb-16 pt-48 text-center">
                <motion.p
                    className="relative z-10 text-sm text-gray-700 dark:text-gray-300"
                    variants={textVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    © Dennis Jonathan {new Date().getFullYear()}
                </motion.p>
            </div>
        </footer>
    );
};

export default Footer;
