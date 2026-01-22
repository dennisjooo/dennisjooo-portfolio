import { NAVBAR_OFFSET } from '@/lib/constants/scrolling';

/**
 * Calculates the scroll position to center an element in the viewport
 * @param element - The element to center
 * @returns The scroll position to center the element
 */
export function calculateCenteredScrollPosition(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const absoluteElementTop = rect.top + window.scrollY;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (rect.height / 2) + NAVBAR_OFFSET;
    return middle;
}

/**
 * Scrolls to center an element in the viewport
 * @param element - The element to scroll to
 * @param smooth - Whether to use smooth scrolling (default: true)
 */
export function scrollToCentered(element: HTMLElement, smooth: boolean = true): void {
    const scrollPosition = calculateCenteredScrollPosition(element);
    window.scrollTo({
        top: scrollPosition,
        behavior: smooth ? 'smooth' : 'instant'
    });
}

/**
 * Scrolls to top, using Lenis if available for smooth scrolling
 * @param instant - Whether to scroll instantly (default: false)
 */
export function scrollToTop(instant: boolean = false): void {
    if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: instant });
    } else {
        window.scrollTo({ top: 0, behavior: instant ? 'instant' : 'smooth' });
    }
}

/**
 * Force scroll to top for navigation - stops Lenis, scrolls, then resumes
 * Used when navigating between pages to ensure scroll position is reset
 */
export function forceScrollToTop(): void {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    if (window.lenis) {
        // Stop Lenis temporarily to prevent interference
        window.lenis.stop();
        window.lenis.scrollTo(0, { immediate: true });

        // Resume Lenis after a frame
        requestAnimationFrame(() => {
            window.lenis?.start();
        });
    } else {
        window.scrollTo(0, 0);
    }
}

/**
 * Refreshes GSAP ScrollTrigger if available
 * Used after scroll position changes to update scroll-based animations
 */
export async function refreshScrollTrigger(): Promise<void> {
    try {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
    } catch {
        // ScrollTrigger not loaded yet, ignore
    }
}
