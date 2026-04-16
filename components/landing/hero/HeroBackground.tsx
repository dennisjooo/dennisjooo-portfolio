"use client";

import { useTheme } from 'next-themes';
import Grainient from './Grainient';
import { useEffect, useState, useRef, useCallback } from 'react';

interface GrainientControl {
    startLoop: () => void;
    stopLoop: () => void;
}

interface ContainerWithControl extends HTMLDivElement {
    grainientControl?: GrainientControl;
}

export function HeroBackground() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleVisibilityChange = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        
        // Control Grainient animation - Grainient exposes control on its container
        const grainientContainer = containerRef.current?.querySelector('.grainient-container') as ContainerWithControl | null;
        if (grainientContainer?.grainientControl) {
            if (entry.isIntersecting) {
                grainientContainer.grainientControl.startLoop();
            } else {
                grainientContainer.grainientControl.stopLoop();
            }
        }
    }, []);

    useEffect(() => {
        setMounted(true);

        const observer = new IntersectionObserver(handleVisibilityChange, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [handleVisibilityChange]);

    const themeReady = resolvedTheme === 'dark' || resolvedTheme === 'light';
    const isDark = resolvedTheme === 'dark';

    // Light Theme Colors
    const lightColors = {
        color1: '#A78BFA',
        color2: '#DDD6FE',
        color3: '#818CF8',
    };

    // Dark Theme Colors
    const darkColors = {
        color1: '#721CA1',
        color2: '#8033CC',
        color3: '#A640D9',
    };

    const activeColors = isDark ? darkColors : lightColors;
    const isVisible = mounted && themeReady;

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-0 mix-blend-normal transition-opacity duration-300 ${
                isVisible ? 'opacity-90' : 'opacity-0'
            }`}
        >
            {isVisible && (
                <Grainient
                    color1={activeColors.color1}
                    color2={activeColors.color2}
                    color3={activeColors.color3}
                    timeSpeed={0.25}
                    colorBalance={0}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={2}
                    warpAmplitude={50}
                    blendAngle={0}
                    blendSoftness={0.05}
                    rotationAmount={500}
                    noiseScale={2}
                    grainAmount={0.1}
                    grainScale={2}
                    grainAnimated={false}
                    contrast={1.5}
                    gamma={1}
                    saturation={1}
                    centerX={0}
                    centerY={0}
                    zoom={0.9}
                />
            )}
            <div className="absolute inset-0 bg-background/20 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}
