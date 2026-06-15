import { NAVBAR_OFFSET } from "@/lib/constants/scrolling";

const PENDING_SECTION_KEY = "portfolio-pending-section";
const SCROLL_ANIMATIONS_READY = "portfolio:scroll-animations-ready";
const LENIS_READY = "portfolio:lenis-ready";
const CONTENT_REVEALED = "portfolio:content-revealed";

let scrollAnimationsReady = false;

export function setScrollAnimationsReady(ready: boolean): void {
  scrollAnimationsReady = ready;
}

export function setPendingSectionScroll(sectionId: string): void {
  sessionStorage.setItem(PENDING_SECTION_KEY, sectionId);
}

export function getPendingSectionScroll(): string | null {
  return sessionStorage.getItem(PENDING_SECTION_KEY);
}

export function clearPendingSectionScroll(): void {
  sessionStorage.removeItem(PENDING_SECTION_KEY);
}

export function isSectionNavigationPending(): boolean {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash ? window.location.hash.substring(1) : "";
  return (hash !== "" && hash !== "home") || getPendingSectionScroll() !== null;
}

export function resolveSectionScrollTarget(): string {
  const hash = window.location.hash ? window.location.hash.substring(1) : "";
  return hash || getPendingSectionScroll() || "";
}

export function disableScrollRestoration(): void {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

export function calculateCenteredScrollPosition(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const absoluteElementTop = rect.top + window.scrollY;
  const middle =
    absoluteElementTop -
    window.innerHeight / 2 +
    rect.height / 2 +
    NAVBAR_OFFSET;
  return middle;
}

export function scrollToCentered(
  element: HTMLElement,
  smooth: boolean = false,
): void {
  const scrollPosition = calculateCenteredScrollPosition(element);

  if (window.lenis) {
    window.lenis.scrollTo(scrollPosition, { immediate: !smooth });
  } else {
    window.scrollTo({
      top: scrollPosition,
      behavior: smooth ? "smooth" : "instant",
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
    window.scrollTo({ top: 0, behavior: instant ? "instant" : "smooth" });
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
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
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

function getSectionScrollTop(el: HTMLElement): number {
  const target = (el.closest(".pin-spacer") as HTMLElement) ?? el;
  return target.getBoundingClientRect().top + window.scrollY;
}

/**
 * GSAP pin-spacers break scrollIntoView on pinned elements; scroll to the spacer instead.
 * Sections align to the viewport top so the sticky hero is fully covered by home-content.
 */
export function scrollToSection(sectionId: string, instant = true): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const top = getSectionScrollTop(el);

  if (window.lenis) {
    window.lenis.scrollTo(top, { immediate: instant });
  } else {
    window.scrollTo({ top, behavior: instant ? "instant" : "smooth" });
  }
}

function waitForWindowEvent(
  eventName: string,
  timeoutMs: number,
): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    window.addEventListener(
      eventName,
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

async function waitForContentRevealed(timeoutMs = 3000): Promise<void> {
  if (document.querySelector('[data-content-ready="true"]')) return;
  await waitForWindowEvent(CONTENT_REVEALED, timeoutMs);
}

async function waitForLenis(timeoutMs = 3000): Promise<void> {
  if (window.lenis) return;

  const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (isMobile || prefersReducedMotion) return;

  await waitForWindowEvent(LENIS_READY, timeoutMs);

  const start = performance.now();
  while (!window.lenis && performance.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function waitForScrollAnimations(timeoutMs = 4000): Promise<void> {
  if (scrollAnimationsReady) return;
  await waitForWindowEvent(SCROLL_ANIMATIONS_READY, timeoutMs);
}

function isSectionAligned(sectionId: string): boolean {
  const el = document.getElementById(sectionId);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  return Math.abs(rect.top) <= 8 && rect.bottom > 0;
}

export async function scrollToSectionWhenReady(
  sectionId: string,
): Promise<void> {
  await waitForContentRevealed();
  await Promise.all([waitForLenis(), waitForScrollAnimations()]);

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await refreshScrollTrigger();

    if (!document.getElementById(sectionId)) {
      await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
      continue;
    }

    scrollToSection(sectionId, true);

    await new Promise((resolve) => setTimeout(resolve, 80 + attempt * 50));

    if (isSectionAligned(sectionId)) return;
  }
}
