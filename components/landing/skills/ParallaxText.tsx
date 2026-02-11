"use client";

import { useRef, useState, useEffect } from "react";
import {
  m,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useInView
} from "framer-motion";
import { wrap } from "@/lib/utils/math";

interface ParallaxTextProps {
  children: React.ReactNode;
  baseVelocity: number;
}

export function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Pause animation on hover
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Smoother spring settings for fluid motion
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 100,
    stiffness: 200,
    mass: 0.5
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3], {
    clamp: false
  });

  /**
   * This is a magic number for the wrap logic.
   * Depending on how many children copies you have, you might need to adjust.
   * We typically wrap between -20% and -45% to ensure seamless looping
   * of 4 copies.
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-10%" });

  // Smooth delta tracking for consistent animation speed
  const smoothDelta = useRef(16.67); // Start with ~60fps assumption

  useAnimationFrame((t, delta) => {
    // Skip animation if not in view, user prefers reduced motion, or is hovered
    if (!isInView || prefersReducedMotion || isHovered) return;

    // Use exponential smoothing for delta to avoid sudden jumps
    // This creates consistent animation speed even on variable frame rates
    const alpha = 0.1; // Smoothing factor (lower = smoother)
    smoothDelta.current = alpha * Math.min(delta, 100) + (1 - alpha) * smoothDelta.current;

    // Use smoothed delta for movement calculation
    let moveBy = directionFactor.current * baseVelocity * (smoothDelta.current / 1000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    const velocity = velocityFactor.get();
    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocity;

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={containerRef}
      className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <m.div
        className="flex whitespace-nowrap gap-8 md:gap-16 flex-nowrap transform-gpu backface-hidden"
        style={{ x, willChange: isInView ? 'transform' : 'auto' }}
      >
        {/* Render 4 copies for seamless loop */}
        <span className="block flex-shrink-0">{children}</span>
        <span className="block flex-shrink-0">{children}</span>
        <span className="block flex-shrink-0">{children}</span>
        <span className="block flex-shrink-0">{children}</span>
      </m.div>
    </div>
  );
}
