'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasMouse, setHasMouse] = useState(false);
    const [cursorVariant, setCursorVariant] = useState('default');
    const [cursorText, setCursorText] = useState('');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring config for the trailing circle
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setHasMouse(true);
            setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        // Determine cursor variant based on hovered element
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Traverse up to find closest relevant element
            const interactiveEl = target.closest('a, button, [data-cursor], input, textarea, select');
            
            if (interactiveEl) {
                const cursorType = interactiveEl.getAttribute('data-cursor');
                
                if (cursorType === 'magnetic') {
                    setCursorVariant('magnetic');
                } else if (cursorType === 'view') {
                    setCursorVariant('view');
                    setCursorText(interactiveEl.getAttribute('data-cursor-text') || 'View');
                } else if (cursorType === 'text' || ['INPUT', 'TEXTAREA'].includes(interactiveEl.tagName)) {
                    setCursorVariant('text');
                } else {
                    // Default interactive hover (links, buttons)
                    setCursorVariant('link');
                }
            } else {
                setCursorVariant('default');
                setCursorText('');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    if (!hasMouse) return null;

    const variants = {
        default: {
            width: 40,
            height: 40,
            backgroundColor: 'transparent',
            border: '1px solid rgba(150, 150, 150, 0.5)',
            mixBlendMode: 'normal' as any,
            opacity: isVisible ? 1 : 0,
        },
        link: {
            width: 80,
            height: 80,
            backgroundColor: 'transparent',
            border: '2px solid white',
            mixBlendMode: 'difference' as any,
            opacity: isVisible ? 1 : 0,
        },
        text: {
            width: 2,
            height: 24,
            backgroundColor: 'currentColor',
            border: 'none',
            borderRadius: '0px',
            mixBlendMode: 'difference' as any,
            opacity: isVisible ? 1 : 0,
        },
        magnetic: {
            width: 60,
            height: 60,
            backgroundColor: 'transparent',
            border: '1px solid rgba(150, 150, 150, 0.8)',
            mixBlendMode: 'normal' as any,
            opacity: isVisible ? 1 : 0,
        },
        view: {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            mixBlendMode: 'normal' as any,
            opacity: isVisible ? 1 : 0,
            color: 'black',
        }
    };

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* The small dot */}
            <motion.div
                className="fixed left-0 top-0 pointer-events-none"
                style={{
                    x: mouseX,
                    y: mouseY,
                    opacity: cursorVariant === 'text' || cursorVariant === 'view' ? 0 : isVisible ? 1 : 0,
                }}
            >
                <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black dark:bg-white mix-blend-difference" />
            </motion.div>
            
            {/* The trailing circle / shape */}
            <motion.div
                className="fixed left-0 top-0 pointer-events-none"
                style={{ x: springX, y: springY }}
            >
                <motion.div
                    className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full pointer-events-none"
                    variants={variants}
                    animate={cursorVariant}
                    transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                >
                    {cursorVariant === 'view' && (
                        <span className="text-xs font-bold uppercase tracking-widest text-black">
                            {cursorText}
                        </span>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
