/**
 * Shared performance constants for responsive optimizations
 */

// Breakpoint for mobile detection
export const MOBILE_BREAKPOINT = 768;

// Footer gradient configurations
export const FOOTER_CONFIG = {
    desktop: {
        blurRadius: 30,
        gradient: `radial-gradient(ellipse at center,
            var(--gradient-accent-from) 0%,
            var(--gradient-accent-from) 15%,
            var(--gradient-accent-via) 40%,
            var(--gradient-accent-to) 60%,
            transparent 80%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
    },
    mobile: {
        blurRadius: 15,
        gradient: `radial-gradient(ellipse at center,
            var(--gradient-accent-from) 0%,
            var(--gradient-accent-via) 40%,
            var(--gradient-accent-to) 70%,
            transparent 90%)`,
    },
} as const;
