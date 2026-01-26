export { MotionProvider } from './MotionProvider';
export { m, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Shared spring configurations for consistent motion feel across the site.
 * Use these instead of custom transitions for visual consistency.
 */
export const springConfigs = {
    /** Quick and responsive - for hovers, micro-interactions */
    snappy: { type: 'spring', stiffness: 300, damping: 30 } as const,
    /** Elegant entrance - for reveals, cards entering view */
    smooth: { type: 'spring', stiffness: 120, damping: 20 } as const,
    /** Slow and graceful - for large elements, headlines */
    gentle: { type: 'spring', stiffness: 80, damping: 20 } as const,
} as const;

/**
 * Common viewport settings for whileInView animations.
 * Negative margins trigger animation before element is fully visible.
 */
export const viewportSettings = {
    /** Standard reveal - triggers 50px before visible */
    once: { once: true, margin: '-50px' } as const,
    /** Deeper trigger - for hero/featured content, triggers 100px before */
    onceDeep: { once: true, margin: '-100px' } as const,
} as const;
