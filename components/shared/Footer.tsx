'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef, useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT, FOOTER_CONFIG } from '@/lib/constants/performance';

const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const prefersReducedMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }, []);

    const gradientVariants = useMemo(() => ({
        hidden: { opacity: 0, scaleY: 0.15 },
        visible: { opacity: 0.7, scaleY: 1 }
    }), []);

    const textVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 }
    }), []);

    const config = isMobile ? FOOTER_CONFIG.mobile : FOOTER_CONFIG.desktop;

    return (
        <footer ref={ref} className="relative w-full overflow-hidden">
            {/* Wrapper handles centering so Framer can animate scale without overriding transforms */}
            <div className="pointer-events-none absolute left-1/2 top-full h-[103%] w-[130%] -translate-x-1/2 -translate-y-[60%] sm:w-[140%]">
                <motion.div
                    className="h-full w-full rounded-full"
                    variants={gradientVariants}
                    initial={prefersReducedMotion ? "visible" : "hidden"}
                    animate={isInView ? "visible" : "hidden"}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        transformOrigin: 'center bottom',
                        backgroundImage: config.gradient,
                        filter: `blur(${config.blurRadius}px)`,
                    }}
                />
            </div>
            <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-8 pb-16 pt-48 text-center">
                <motion.p
                    className="relative z-10 text-sm text-gray-700 dark:text-gray-300"
                    variants={textVariants}
                    initial={prefersReducedMotion ? "visible" : "hidden"}
                    animate={isInView ? "visible" : "hidden"}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
                >
                    © Dennis Jonathan {new Date().getFullYear()}
                </motion.p>
            </div>
        </footer>
    );
};

export default Footer;
