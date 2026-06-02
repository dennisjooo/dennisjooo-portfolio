"use client";

import { useTheme } from 'next-themes';
import Grainient from './Grainient';
import { useEffect, useState, useRef, useCallback } from 'react';

interface GrainientControl {
    startLoop: () => void;
    stopLoop: () => void;
    resize: () => void;
}

interface ContainerWithControl extends HTMLDivElement {
    grainientControl?: GrainientControl;
}

export function HeroBackground() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [allowGrainient, setAllowGrainient] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleVisibilityChange = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        
        const grainientContainer = containerRef.current?.querySelector('.grainient-container') as ContainerWithControl | null;
        if (grainientContainer?.grainientControl) {
            if (entry.isIntersecting) {
                grainientContainer.grainientControl.resize();
                grainientContainer.grainientControl.startLoop();
            } else {
                grainientContainer.grainientControl.stopLoop();
            }
        }
    }, []);

    useEffect(() => {
        const win = window as Window & {
            requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
            cancelIdleCallback?: (handle: number) => void;
        };

        setMounted(true);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            setAllowGrainient(false);
        } else if (typeof win.requestIdleCallback === 'function') {
            const idleId = win.requestIdleCallback(
                () => setAllowGrainient(true),
                { timeout: 1200 }
            );
            return () => win.cancelIdleCallback?.(idleId);
        } else {
            const timer = setTimeout(() => setAllowGrainient(true), 400);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (!allowGrainient) return;

        const observer = new IntersectionObserver(handleVisibilityChange, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [allowGrainient, handleVisibilityChange]);

    const themeReady = resolvedTheme === 'dark' || resolvedTheme === 'light';
    const isDark = resolvedTheme === 'dark';

    useEffect(() => {
        if (!allowGrainient || !themeReady) return;

        const grainientContainer = containerRef.current?.querySelector(
            '.grainient-container'
        ) as ContainerWithControl | null;

        const frame = requestAnimationFrame(() => {
            grainientContainer?.grainientControl?.resize();
        });

        return () => cancelAnimationFrame(frame);
    }, [allowGrainient, resolvedTheme, themeReady]);

    const lightColors = {
        color1: '#B0B0B0',
        color2: '#D0D0D0',
        color3: '#A0A0A0',
    };

    const darkColors = {
        color1: '#404040',
        color2: '#505050',
        color3: '#606060',
    };

    const activeColors = isDark ? darkColors : lightColors;
    const isVisible = mounted && themeReady;
    const fallbackBackground = `linear-gradient(135deg, ${activeColors.color1} 0%, ${activeColors.color2} 45%, ${activeColors.color3} 100%)`;

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-0 mix-blend-normal transition-opacity duration-300 ${
                isVisible ? 'opacity-90' : 'opacity-0'
            }`}
        >
            {isVisible && allowGrainient && (
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
            {isVisible && !allowGrainient && (
                <div
                    className="absolute inset-0"
                    style={{ background: fallbackBackground }}
                />
            )}
            <div className="absolute inset-0 bg-background/20 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}
