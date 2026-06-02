import { useState, useRef, useCallback, useEffect } from 'react';
import { Heading } from '@/lib/utils/markdownHelpers';
import { SCROLL_ANIMATION_DURATION } from '@/lib/constants/scrolling';

export function useActiveHeading(headings: Heading[]) {
    const [activeId, setActiveId] = useState<string>('');
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const manualScrollLockRef = useRef<NodeJS.Timeout | null>(null);
    const isManualScrollLocked = useRef<boolean>(false);

    const updateActiveHeading = useCallback(() => {
        if (isManualScrollLocked.current) return;

        if (headings.length === 0) return;

        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const isNearBottom = scrollY + viewportHeight >= documentHeight - 100;

        const headingPositions = headings.map((heading) => {
            const element = document.getElementById(heading.id);
            if (!element) return null;

            const rect = element.getBoundingClientRect();
            const absoluteTop = rect.top + scrollY;

            return {
                id: heading.id,
                top: absoluteTop,
                distanceFromTop: rect.top
            };
        }).filter((h): h is NonNullable<typeof h> => h !== null);

        if (headingPositions.length === 0) return;

        if (isNearBottom) {
            const lastHeading = headingPositions[headingPositions.length - 1];
            if (lastHeading.id !== activeId) {
                setActiveId(lastHeading.id);
            }
            return;
        }

        const centerOfViewport = viewportHeight / 2;
        const threshold = 100;

        let bestHeading = headingPositions[0];
        let bestScore = Infinity;

        for (const heading of headingPositions) {
            const distanceFromCenter = heading.distanceFromTop - centerOfViewport;

            let score;
            if (distanceFromCenter <= threshold) {
                score = Math.abs(distanceFromCenter);
            } else {
                score = distanceFromCenter * 10;
            }

            if (score < bestScore) {
                bestScore = score;
                bestHeading = heading;
            }
        }

        if (bestHeading.id !== activeId) {
            setActiveId(bestHeading.id);
        }
    }, [headings, activeId]);

    useEffect(() => {
        updateActiveHeading();

        const handleScroll = () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            requestAnimationFrame(() => {
                updateActiveHeading();
            });

            scrollTimeoutRef.current = setTimeout(() => {
                updateActiveHeading();
            }, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [updateActiveHeading]);

    return {
        activeId,
        setActiveId: (id: string) => {
            setActiveId(id);
            isManualScrollLocked.current = true;

            if (manualScrollLockRef.current) {
                clearTimeout(manualScrollLockRef.current);
            }

            manualScrollLockRef.current = setTimeout(() => {
                isManualScrollLocked.current = false;
            }, SCROLL_ANIMATION_DURATION);
        }
    };
}
