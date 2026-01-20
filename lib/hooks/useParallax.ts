'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

interface ParallaxConfig {
    damping?: number;
    stiffness?: number;
    foregroundRange?: [number, number];
    backgroundRange?: [number, number];
}

interface ParallaxResult {
    mounted: boolean;
    foreground: {
        x: MotionValue<number>;
        y: MotionValue<number>;
    };
    background: {
        x: MotionValue<number>;
        y: MotionValue<number>;
    };
}

const DEFAULT_CONFIG: Required<ParallaxConfig> = {
    damping: 30,
    stiffness: 200,
    foregroundRange: [40, -40],
    backgroundRange: [-20, 20],
};

export function useParallax(config: ParallaxConfig = {}): ParallaxResult {
    const {
        damping,
        stiffness,
        foregroundRange,
        backgroundRange,
    } = { ...DEFAULT_CONFIG, ...config };

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping, stiffness };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Foreground transforms (inverted for depth effect)
    const fgX = useTransform(springX, [-0.5, 0.5], foregroundRange);
    const fgY = useTransform(springY, [-0.5, 0.5], foregroundRange);

    // Background transforms (slower, opposite direction)
    const bgX = useTransform(springX, [-0.5, 0.5], backgroundRange);
    const bgY = useTransform(springY, [-0.5, 0.5], backgroundRange);

    const [mounted, setMounted] = useState(false);
    const rafId = useRef<number | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Throttled update using RAF for smoother performance on mid-tier devices
    const updateMousePosition = useCallback(() => {
        mouseX.set(lastMousePos.current.x);
        mouseY.set(lastMousePos.current.y);
        rafId.current = null;
    }, [mouseX, mouseY]);

    useEffect(() => {
        setMounted(true);

        // Disable parallax on touch devices for better performance
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            lastMousePos.current = {
                x: e.clientX / innerWidth - 0.5,
                y: e.clientY / innerHeight - 0.5
            };

            // Throttle updates to once per frame
            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(updateMousePosition);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [mouseX, mouseY, updateMousePosition]);

    return {
        mounted,
        foreground: { x: fgX, y: fgY },
        background: { x: bgX, y: bgY },
    };
}
