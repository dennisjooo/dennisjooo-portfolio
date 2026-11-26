import type { RefObject } from "react";
import type { ContentSection } from "@/lib/content/aboutContent";

type GsapInstance = typeof import("gsap").default;
type Timeline = ReturnType<GsapInstance["timeline"]>;
type Tween = ReturnType<GsapInstance["to"]>;

const gsapLoad = () =>
  import("@/lib/motion/gsapBootstrap").then((m) =>
    m.loadGsapWithScrollTrigger(),
  );

void gsapLoad();

const aboutScrollTrigger = {
  start: "top top",
  end: "bottom bottom",
  scrub: 0.5,
  invalidateOnRefresh: true,
} as const;

export function setupAboutMobileAnimations(
  gsap: GsapInstance,
  sectionRef: RefObject<HTMLDivElement | null>,
  contentSectionCount: number,
): (() => void) | undefined {
  const section = sectionRef.current;
  const mobileContainer = document.querySelector(
    ".mobile-scroll-container",
  ) as HTMLElement | null;
  if (!section || !mobileContainer) return;

  const totalSections = 1 + Math.max(contentSectionCount, 1);
  const lastIndex = Math.max(totalSections - 1, 1);

  const tween: Tween = gsap.to(mobileContainer, {
    xPercent: -((100 * (totalSections - 1)) / totalSections),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      ...aboutScrollTrigger,
      snap: {
        snapTo: 1 / lastIndex,
        duration: { min: 0.15, max: 0.3 },
        ease: "power2.out",
        inertia: false,
      },
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export function setupAboutDesktopAnimations(
  gsap: GsapInstance,
  sectionRef: RefObject<HTMLDivElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  contentSections: ContentSection[],
): (() => void) | undefined {
  const section = sectionRef.current;
  const root = containerRef.current;
  if (!section || !root) return;

  const titles = Array.from(root.querySelectorAll<HTMLElement>(".about-title"));
  const bodies = Array.from(root.querySelectorAll<HTMLElement>(".about-body"));

  titles.forEach((title, i) => {
    gsap.set(
      title,
      i === 0 ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: -30 },
    );
  });
  bodies.forEach((body, i) => {
    gsap.set(body, i === 0 ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 20 });
  });

  const tl: Timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      ...aboutScrollTrigger,
    },
  });

  contentSections.forEach((_, i) => {
    if (i === contentSections.length - 1) return;

    const currentTitle = titles[i];
    const nextTitle = titles[i + 1];
    const currentBody = bodies[i];
    const nextBody = bodies[i + 1];
    if (!currentTitle || !nextTitle || !currentBody || !nextBody) return;

    tl.to(
      currentTitle,
      { autoAlpha: 0, y: -30, duration: 0.6, ease: "power2.in" },
      `step-${i}`,
    )
      .to(
        currentBody,
        { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" },
        `step-${i}`,
      )
      .fromTo(
        nextTitle,
        { autoAlpha: 0, y: -30 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
        `step-${i}+=0.3`,
      )
      .fromTo(
        nextBody,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        `step-${i}+=0.5`,
      );

    tl.to({}, { duration: 0.4 });
  });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export async function initAboutGsapAnimations(
  sectionRef: RefObject<HTMLDivElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  contentSections: ContentSection[],
): Promise<() => void> {
  const { gsap } = await gsapLoad();

  const mm = gsap.matchMedia();

  mm.add("(max-width: 767px)", () =>
    setupAboutMobileAnimations(gsap, sectionRef, contentSections.length),
  );

  mm.add("(min-width: 768px)", () =>
    setupAboutDesktopAnimations(
      gsap,
      sectionRef,
      containerRef,
      contentSections,
    ),
  );

  return () => {
    mm.revert();
  };
}
