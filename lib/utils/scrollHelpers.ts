import { NAVBAR_OFFSET } from '@/lib/constants/scrolling';

export function disableScrollRestoration(): void {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
}

export function calculateCenteredScrollPosition(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const absoluteElementTop = rect.top + window.scrollY;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (rect.height / 2) + NAVBAR_OFFSET;
    return middle;
}

export function scrollToCentered(element: HTMLElement, smooth: boolean = false): void {
    const scrollPosition = calculateCenteredScrollPosition(element);

    if (window.lenis) {
        window.lenis.scrollTo(scrollPosition, { immediate: !smooth });
    } else {
        window.scrollTo({
            top: scrollPosition,
            behavior: smooth ? 'smooth' : 'instant'
        });
    }
}

export function scrollToTop(instant: boolean = false): void {
    if (window.lenis) {
        if (instant) {
            window.lenis.stop();
            window.scrollTo(0, 0);
            requestAnimationFrame(() => {
                window.lenis?.start();
            });
        } else {
            window.lenis.scrollTo(0, { immediate: false });
        }
    } else {
        window.scrollTo({ top: 0, behavior: instant ? 'instant' : 'smooth' });
    }
}

export function forceScrollToTop(): void {
    window.scrollTo(0, 0);

    if (window.lenis) {
        window.lenis.stop();

        requestAnimationFrame(() => {
            window.lenis?.start();
        });
    }
}

export async function refreshScrollTrigger(): Promise<void> {
    try {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
    } catch {
        // ScrollTrigger not loaded yet
    }
}

export function scrollToTopWithRefresh(): void {
    forceScrollToTop();
    requestAnimationFrame(() => {
        refreshScrollTrigger();
    });
}

/**
 * GSAP pin-spacers break scrollIntoView on pinned elements; scroll to the spacer instead.
 */
export function scrollToSection(sectionId: string, instant = true): void {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const target = el.closest('.pin-spacer') as HTMLElement ?? el;
    const top = target.getBoundingClientRect().top + window.scrollY;

    if (window.lenis) {
        window.lenis.scrollTo(top, { immediate: instant });
    } else {
        window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
    }
}
