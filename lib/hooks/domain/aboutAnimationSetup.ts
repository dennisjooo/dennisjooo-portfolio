import type { RefObject } from "react";
import type { ContentSection } from "@/lib/content/aboutContent";
import {
  aboutDesktopScrollDistance,
  aboutMobileScrollDistance,
} from "@/lib/constants/aboutScroll";

type GsapInstance = typeof import("gsap").default;

export function setupAboutMobileAnimations(
  gsap: GsapInstance,
  sectionRef: RefObject<HTMLDivElement | null>,
  contentSectionCount: number,
) {
  const mobileContainer = document.querySelector(
    ".mobile-scroll-container",
  ) as HTMLElement;
  if (!mobileContainer) return;

  const totalSections = 1 + Math.max(contentSectionCount, 1);
  const lastIndex = Math.max(totalSections - 1, 1);

  const scrollTriggerInstance = gsap.to(mobileContainer, {
    xPercent: -((100 * (totalSections - 1)) / totalSections),
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: false,
      scrub: 0.5,
      snap: {
        snapTo: 1 / lastIndex,
        duration: { min: 0.15, max: 0.3 },
        ease: "power2.out",
        inertia: false,
      },
      end: `+=${aboutMobileScrollDistance(contentSectionCount)}`,
      fastScrollEnd: true,
      preventOverlaps: true,
      invalidateOnRefresh: true,
    },
  });

  return () => {
    scrollTriggerInstance.scrollTrigger?.kill();
  };
}

export function setupAboutDesktopAnimations(
  gsap: GsapInstance,
  sectionRef: RefObject<HTMLDivElement | null>,
  contentSections: ContentSection[],
) {
  const titles = gsap.utils.toArray<HTMLElement>(".about-title");
  const bodies = gsap.utils.toArray<HTMLElement>(".about-body");

  titles.forEach((title, i) => {
    if (i !== 0) gsap.set(title, { opacity: 0, y: -30 });
    else gsap.set(title, { opacity: 1, y: 0 });
  });
  bodies.forEach((body, i) => {
    if (i !== 0) gsap.set(body, { opacity: 0, y: 20 });
    else gsap.set(body, { opacity: 1, y: 0 });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${aboutDesktopScrollDistance(contentSections.length)}`,
      pin: true,
      pinSpacing: false,
      scrub: 0.5,
      anticipatePin: 1,
    },
  });

  contentSections.forEach((_, i) => {
    if (i === contentSections.length - 1) return;

    const currentTitle = titles[i];
    const nextTitle = titles[i + 1];
    const currentBody = bodies[i];
    const nextBody = bodies[i + 1];

    tl.to(
      currentTitle,
      { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" },
      `step-${i}`,
    )
      .to(
        currentBody,
        { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
        `step-${i}`,
      )
      .to(
        nextTitle,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        `step-${i}+=0.3`,
      )
      .to(
        nextBody,
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        `step-${i}+=0.5`,
      );

    tl.to({}, { duration: 0.4 });
  });
}

export async function initAboutGsapAnimations(
  sectionRef: RefObject<HTMLDivElement | null>,
  contentSections: ContentSection[],
): Promise<() => void> {
  const [gsap, { ScrollTrigger }] = await Promise.all([
    import("gsap").then((m) => m.default),
    import("gsap/ScrollTrigger"),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();
  let mobileCleanup: (() => void) | undefined;

  mm.add("(max-width: 767px)", () => {
    mobileCleanup = setupAboutMobileAnimations(
      gsap,
      sectionRef,
      contentSections.length,
    );
    return mobileCleanup;
  });

  mm.add("(min-width: 768px)", () => {
    setupAboutDesktopAnimations(gsap, sectionRef, contentSections);
  });

  return () => {
    mm.revert();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
