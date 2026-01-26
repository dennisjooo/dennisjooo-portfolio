'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProviderProps {
    children: ReactNode;
}

/**
 * LazyMotion wrapper that loads only essential animation features (domAnimation)
 * This reduces bundle size by ~50% compared to full framer-motion imports
 * 
 * Use `m` instead of `motion` for components within this provider
 */
export const MotionProvider = ({ children }: MotionProviderProps) => (
    <LazyMotion features={domAnimation} strict>
        {children}
    </LazyMotion>
);
